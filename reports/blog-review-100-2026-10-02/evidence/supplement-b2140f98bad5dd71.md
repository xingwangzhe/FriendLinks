[ Skip to content ](https://prince213.top/blog/2026/01/05/tproxy/#configuring-transparent-proxy-with-nftables)
[ ](https://prince213.top/ "prince213")
prince213 
Configuring transparent proxy with nftables 
  * [ Welcome ](https://prince213.top/)
  * [ Blog ](https://prince213.top/blog/)
  * [ Events ](https://prince213.top/events/nixos-cn-meetup-1/)
  * [ Notes ](https://prince213.top/notes/)


[ ](https://prince213.top/ "prince213") prince213 
  * [ Welcome  ](https://prince213.top/)
  * Blog  Blog 
    * [ Blog  ](https://prince213.top/blog/)
    * Archive  Archive 
      * [ 2026  ](https://prince213.top/blog/archive/2026/)
      * [ 2025  ](https://prince213.top/blog/archive/2025/)
  * Events  Events 
    * [ NixOS CN Meetup #1  ](https://prince213.top/events/nixos-cn-meetup-1/)
  * Notes  Notes 
    * [ Notes  ](https://prince213.top/notes/)
    * [ DN42  ](https://prince213.top/notes/dn42/)
    * [ GeekPie Printer  ](https://prince213.top/notes/geekpie-printer/)
    * Nix  Nix 
      * [ nodePackages.sharp  ](https://prince213.top/notes/nix/nodePackages.sharp/)
      * [ Ruby Bundler  ](https://prince213.top/notes/nix/ruby-bundler-install/)


[ Back to index  ](https://prince213.top/blog/)
  * Metadata 
    * January 5, 2026
    * 3 min read 


# Configuring transparent proxy with nftables
I took some time to update the network infrastructure at my workplace with a new Wi-Fi router, and one of the goals was to enable zero-configration connections to the intranet. Thanks to nftables, it really was an experience.
For a transparent proxy router, there are 3 kinds of traffic to consider:
  1. Traffic from LAN to WAN
  2. Outgoing traffic from the router
  3. Incoming traffic to the router (e.g. SSH)


And the traffic flows are like:
  1. LAN -> prerouting -> input -> sing-box -> output -> WAN -> prerouting -> input -> sing-box -> output -> LAN
  2. curl -> output -> prerouting -> input -> sing-box -> output -> LAN/WAN -> prerouting -> input -> sing-box -> output -> prerouting -> input -> curl
  3. LAN/WAN -> prerouting -> input -> ssh -> output -> LAN/WAN


Because the router is remotely provisioned, I'll implement 3 first.

```
table ip sing-box {
  chain input {
    type filter hook input priority mangle; policy accept;
    ct state new ct mark set 1 accept;
  }

  chain output {
    type route hook output priority mangle; policy accept;
    ct mark 1 accept;
  }

  chain prerouting {
    type filter hook prerouting priority mangle; policy accept;
    fib daddr type { broadcast, local, multicast } accept;
  }
}

```

Here we use the conntrack mechanism to mark new connections (with `ct mark set 1`) and send reply packets directly.
Next, we can implement 2. Since we can't use `tproxy` in output chain, we have to route the packets sent by local programs to the lookback interface `lo`. This can be done with policy based routing by letting packets with a specific firewall mark (here we use `meta mark 1`) use a specific routing table who has a single default rule to device `lo`:

```
ip rule add fwmark 1 lookup 100
ip route add local default dev lo table 100

```

Or equivalently in NixOS with systemd-networkd:

```
{
  systemd.network.networks."10-lo" = {
    name = "lo";
    routingPolicyRules = [
      {
        FirewallMark = 1;
        Table = 100;
      }
    ];
    routes = [
      {
        Type = "local";
        Destination = "0.0.0.0/0";
        Table = 100;
      }
    ];
  };
}

```

Next, the proxy program needs to be configured to add `meta mark 2` to all packets it send so we don't create routing loops.
Finall we can `tproxy` the packets in the prerouting chain.

```
table ip sing-box {
  chain input {
    type filter hook input priority mangle; policy accept;
    meta mark != 1 ct state new ct mark set 1 accept;
  }

  chain output {
    type route hook output priority mangle; policy accept;
    ct mark 1 accept;
    meta mark 2 accept;
    meta l4proto { tcp, udp } meta mark set 1 accept;
  }

  chain prerouting {
    type filter hook prerouting priority mangle; policy accept;
    fib daddr type { broadcast, local, multicast } accept;
    meta l4proto { tcp, udp } meta mark 1 tproxy to :12345 accept;
  }
}

```

Finally we can implement 1 and we need to once again use conntrack to properly reply packets to LAN.

```
table ip sing-box {
  chain input {
    type filter hook input priority mangle; policy accept;
    meta mark != 1 ct state new ct mark set 1 accept;
  }

  chain output {
    type route hook output priority mangle; policy accept;
    ct mark 1 accept;
    ct mark 2 accept;
    meta mark 2 accept;
    meta l4proto { tcp, udp } meta mark set 1 accept;
  }

  chain prerouting {
    type filter hook prerouting priority mangle; policy accept;
    fib daddr type { broadcast, local, multicast } accept;
    meta l4proto { tcp, udp } meta mark != 1 meta mark set 1 ct mark set 2 tproxy to :12345 accept;
    meta l4proto { tcp, udp } meta mark 1 tproxy to :12345 accept;
  }
}

```

Copyright © 2025 Sizhe Zhao 
Made with [ Material for MkDocs ](https://squidfunk.github.io/mkdocs-material/)
