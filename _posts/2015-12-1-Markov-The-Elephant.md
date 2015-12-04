---
layout: post
title: Markov The Elephant
abTests = [ subtitle ]
---

{: .absubtitle1}
_A Quick Toy Problem_

To kick off my blog, here is a fun little math problem that came to me recently.

Last year my kids got an elephant toy which tossed balls in the air while playing incredibly loud music. They LOVE it. Each time it tosses a ball in the air, it has roughly a 50% chance of falling into the elephant's left ear and being tossed into the air again. Otherwise, it falls into the elephant's right ear and is deposited at the elephant's feet (I think the designers played a little fast and loose with elephant physiology).

<!--more-->

![Elephant Toy]({{ site.url }}/images/elephantToy.PNG)

While trying to block out the penetrating music, I started to wonder about the odds of cycling a given number of times. Since the toy comes with 5 balls, how likely is it for it to cycle 20 times?

To answer this, I created an R script that takens a given number of starting balls, a success probability, and a number of trials (a trial being a full cycle of all remaining balls). It then generates a transition matrix to all possible states (numbers of remaining balls) and applies the matrix to the starting state for each trial. I output the results as a heat map of probabilities of remaining balls per trial. For example, for 5 balls, looks like this:
![Elephant State Probabilities]({{ site.url }}/images/elephantToyResults1.PNG)  
There is a greater than 99.9% probability that it will not go to 20 cycles. Whew!

...but that is assuming there are even odds each time a ball is launched in the air. What if I do something drastic and give the balls only a 10% chance of falling out per cycle?
![Elephant State Probabilities II]({{ site.url }}/images/elephantToyResults.PNG)  
Now there is only a 52% chance of terminating by the 20th cycle. Even the relatively small 10% chance of failure catches up fairly quickly.

...but that's OK, my daughter is very happy to start it up again!