---
layout: post
title: A is for Adversarial
tags: [abTesting, toddlerStats]
references: [cseweb.ucsd.edu/~yfreund/papers/bandits.pdf, 1oclockbuzz.com/2015/11/24/bandit-algorithms-for-bullying-getting-more-lunch-money/, www.chrisstucchio.com/blog/2015/dont_use_bandits.html]
---

Lately, my son has been very curious about words, so I have decided that it is a great time for us to practice letters. One way we practice is with flash cards. I like this method since it is easy to get in a few practice letters between other activities. The problem I am facing is how to choose which letters we practice. Ideally, I want to cover all letters over time, but focus on those he doesn't know and adapt as he learns them.

...enter the adversarial multi-armed bandit!
<!--more-->
![Multi-Armed Bandit]({{ site.url }}/images/stitch.jpg)

Given an array of choices that can be repeated, bandit strategies seek to maximize rewards by learning from past choices. I can frame my problem in this way by seeing each letter as a choice and my son's response as an outcome. Since I want to optimize towards letters he has not yet learned, I will "reward" the model when a letter is chosen that he does not recognize. An issue with this approach is that when my son responds by learning a new letter, my model will have a hard time un-learning to choose that letter. In fact, I expect a diminishing return as I repeat letters and he becomes more likely to recognize them. In this sense, my son's responses are "adversarial".

Besides being a great band name, an adversarial multi-armed bandit is designed to optimize choices over time, even when the mean reward for each choice is non-stationary. It does this by balancing randomness against learned probabilities that decay over time.

The algorithm I have chosen is [Exp3](http://cseweb.ucsd.edu/~yfreund/papers/bandits.pdf){:target="_blank"}, which is short for Exponential-weight algorithm for Exploration and Exploitation. In terms of my situation:

 - **Exploration** - randomly choosing letters to determine my son's knowledge of the alphabet (also has the up-side of occassionally reinforcing letters he already knows)
 - **Exploitation** - preferring letters that he has not done well on in the past

Let's make some code! Here are my functions in R for assigning weights to letters and deriving probabilities from those weights.

~~~r
### Utility Functions ###
# update the weight given to a choice, based on the reward for a trial
updateWeight <- function(weight, probs, choice, reward, gamma=0.0){
  estimatedReward = reward / probs[choice]
  weight * exp(estimatedReward * gamma / length(probs))
}

# create a probability vector from the vector of weights
getProbabilities <- function(weights, gamma=0.0){
  (1.0 - gamma) * (weights / sum(weights)) + (gamma / length(weights))
}
~~~

Now to set up the problem and initialize my parameters. The gamma parameter is a tuning parameter for Exp3 that provides theorical limits to regret (the difference between optimal performance and actual performance). It does this by controlling the balance between exploration and exploitation as described above.

~~~r
# choices = alphabet
choices = unlist(strsplit('ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''))
# upper bound on cumulative reward over convergence time horizon (assuming 1,000 trials)
upperBoundEstimate = 1000
# set gamma parameter
gamma = min(1, sqrt((length(choices) * log(length(choices))) / ((exp(1) - 1) * upperBoundEstimate)))
# initialize weights
choiceWeights = rep(1, length(choices))
choiceProbs = getProbabilities(choiceWeights, gamma)
~~~

Each time I get new data, I can do the following to update my model. Note that I have coded my son's responses in the "Recognized" column, with 1 == recognized and 0 == not recognized. I can also assign scores in between, for example: 0.5 if he recognized the letter after being given a hint as to the sound it makes.

~~~r
### load data ###
trials = read.csv('AlphabetTrials.csv')
# names(trials) -> c('Letter', 'Recognized')
numTrials = nrow(trials)

### loop through trials ###
for( i in 1:numTrials ){
  # choice is index of letter in alphabet
  choice = which(choices == trials$Letter[i])
  # reward == finding a letter that is not recognized
  reward = 1 - trials$Recognized[i]
  # update weights
  choiceWeights[choice] = updateWeight(choiceWeights, choiceProbs, choice, reward, gamma)
  # get associated probabilities
  choiceProbs = getProbabilities(choiceWeights, gamma)
}
~~~

When I want to choose another set of 5 letters to practice, I can simply run:

~~~r
# get next 5 choices for future trials
next5Choices = sample(choices,5,prob=choiceProbs)
# c('U', 'A', 'Z', 'Y', 'F')
~~~

This samples from the model's probability distribution of letters. After 72 trials, my distribution looks like this:

~~~r
barplot(choiceProbs, names.arg = choices, col='skyblue')
~~~

![Letter Probabilities]({{ site.url }}/images/ProbabilityPerLetter.png)
A, D, and U look like the letters we may need to work on most.

I have really been enjoying this method and it seems to work well, but how do I know that it is better than other methods? Without knowing what he would answer for each letter in any given round, there are some ways I can estimate my effectiveness. Based on the results I have seen so far, I would estimate that my son had knowledge of about 30% of letters before we began and 45% now. Assuming that he has progressed linearly, I can compare the actual cumulative reward (ability to find letters he didn't know yet) to the expected cumulative reward from a purely random method.

~~~r
# optimal cumulative reward
plot(1:numTrials, 1:numTrials, type='l', col='blue', lwd=3, xlab='Trials', ylab='Cumulative Reward')
# expected random reward, assuming linear decline from 0.7 avg reward to 0.55
lines(1:numTrials, cumsum((1:numTrials / numTrials)*0.55 + (1-(1:numTrials / numTrials))*0.7), lwd=2, col='darkorange')
# actual reward
lines(1:numTrials, cumsum(1 - trials$Recognized), lwd=2, col='skyblue')
~~~

![Bandit Cumulative Reward]({{ site.url }}/images/cumulativeReward.png)

As you can see, Exp3 is consistently beating the random model. The margin is not amazing, but keep in mind that this is truly an adversarial problem where each trial increases the odds that subsequent trials with the same alternative will not pay off. Due to that, the random model would likely perform more poorly than estimated here.

The professional educational value of this method is debatable (I am not a teacher!), but I had some fun and I think my son and I both learned a lot.