[Skip to content](https://dcutting.com/writing/ai-can-read-my-journal-but-only-locally/#main)
[ ![Derek Cutting portrait](https://dcutting.com/assets/derek_portrait.png) Derek Cutting ](https://dcutting.com/)
  * [Home](https://dcutting.com/)
  * [About](https://dcutting.com/about/)
  * [Projects](https://dcutting.com/projects/)
  * [Writing](https://dcutting.com/writing/)
  * [Subscribe](https://substack.com/@dcutting)


![My sketchbook. Photo by Derek Cutting.](https://dcutting.com/assets/writing/my-sketchbook.jpeg)
AI was not going to read my journal. At least, not if reading it meant sending five years of private thoughts to the servers of OpenAI, Anthropic, or another large AI lab. That was my hard line on how much privacy I was willing to sacrifice for the convenience of AI.
I've been journaling regularly for five years, first in Apple Notes and for the last three years in Obsidian. I write for an audience of one: my future self. Although I've configured whatever privacy features I can in ChatGPT and Claude, I don't trust such personal information passing through their servers.
My future self reads and reflects on past entries through monthly and annual reviews. Using Dataview queries, I can programmatically collect entries from a given period and group them by theme: bullet journal, dreams, gratitude, current events, and so on. The automation helps, but rereading everything is still daunting. That sense of dread leads me to procrastinate and shortchange the reflection.
Not ideal. But the process also wasn't important enough for me to reprioritize my time. I knew AI could help, but the privacy concerns held me back.
Beyond privacy, I also didn't want AI to _write_ the reflection for me. The point of journaling is to think about my life, not outsource that thinking. What I wanted was a _reading partner_ : something that could help me get through the material, notice patterns across entries, and ask better questions. I would still decide what those patterns meant.
## Running AI locally
Then my shiny new MacBook Pro M5 Pro (that's a lot of professionalism) with 48GB of RAM presented another option: I could run a large language model locally. My 12-year-old MacBook Pro had served me well, but it was time to say, "Thank you and goodbye."
For those unfamiliar with local LLMs, this means running the model itself on my computer rather than sending each prompt to a model hosted in a company's data center. Many local models are freely available. They aren't quite as capable as today's frontier cloud-hosted models, but capabilities that would have been cutting-edge only months ago can now run on a laptop.
There is an important caveat. Because I configured Codex to use a local model through Ollama, my understanding is that my prompts and the model's responses are processed on my Mac rather than sent to an OpenAI model. But this was surprisingly hard to verify. [OpenAI's published guidance](https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-impr) explains how Codex content may be handled generally, but I couldn't find documentation that clearly described this local-model configuration or confirmed what the Codex app itself might still transmit. The evidence I found was enough for me to try it, but not enough to make an absolute privacy guarantee. Anyone doing this with sensitive material should remain cautious and skeptical.
## How I set it up
The good news is that you don't need to be a software engineer to try it. I got my system running in about thirty minutes. Here are the steps I followed:
  1. Download the app version of [Ollama](https://ollama.com/download).
  2. Choose and download an [open-source model](https://ollama.com/search). I went with `gemma4:26b-mlx`. Once you find the model you want, copy its name and run the following command in Terminal:

```
ollama pull gemma4:26b-mlx

```

  3. Launch the model in the Codex app by running:

```
ollama launch codex-app

```

  4. In Codex, start a project pointing to the Obsidian vault where your journal entries live and ask it to help with your reflection. I began with this prompt: ![Codex app showing a prompt asking it to review June 2026 journal entries and identify key events, emotional patterns, current events, dream themes, and questions for deeper reflection.](https://dcutting.com/assets/writing/chatgpt-with-local-model.png)
  5. Write your own reflection based on its responses. I still wanted to do the reflecting rather than outsource it to AI.
  6. If the process works, turn it into a repeatable skill. I simply prompted Codex to "take our conversation and turn it into a repeatable skill I can use for subsequent monthly reflections."


## What the model noticed
The model proved especially useful when it could connect entries that I had written weeks apart. In one dream, I was on a cruise ship about to crash into the breakers, unable to control what happened next. The model identified a broader theme in my dreams: the anxiety of not being in control. It then connected that theme to similar feelings in my waking life, particularly at work, where I sometimes feel at the whims of the broader economy and market.
It wasn't a superintelligent insight, but it was something I might have missed while rushing through my journal entries. The model found the parallel; I still had to decide whether it rang true and what I could learn from it.
The responses seemed about on par with what I would expect from a frontier cloud-hosted model. The truth is, I'll never know because I won't send my journal to one for comparison. As long as the local model is sufficient for the task, there is little to gain from wondering what I might be missing.
## The magic of running it locally
Beyond the ease of getting everything working, what surprised me most was how magical it felt. It reminded me of the first time I used ChatGPT and was amazed by its uncanny ability to sustain a humanlike conversation. Back then, my comparison point was the rudimentary, scripted chat systems used by support bots. I'm still shocked by how quickly I became desensitized to what LLMs can do.
Running one locally brought that feeling rushing back. The model's work wasn't happening in some black-box supercomputer in the cloud, housed in a vast data center consuming substantial amounts of water and electricity. It was happening on my laptop, without an internet connection and without even being plugged into the wall. For context, my computer's battery holds about 72Wh, which costs roughly 1.1 cents to fully charge on Seattle's mostly renewable power grid.
About 18 gigabytes of learned parameters were sitting on my hard drive. When I gave the model a prompt, my laptop performed an enormous series of calculations against those parameters and generated a coherent response. The scale of what had been compressed into that file was hard to comprehend.
Sadly, it felt a little closer to dark magic when I considered that much of the material these models learned from was created by people who did not consent to its use and were not compensated for it.
But the real value wasn't that my laptop could produce a reflection for me. It was that the model helped make an onerous but meaningful task easy enough for me to actually do it. It helped me notice a pattern I might otherwise have missed. Then I closed the chat and wrote the reflection myself.
Cover Image: _My sketchbook. Photo by Derek Cutting._
[← Back to all writing](https://dcutting.com/writing/)
# AI Can Read My Journal, but Only Locally
How I used a local model to assist with my monthly reflection
Derek Cutting · July 12, 2026
© 2026 Derek Cutting
