---
title: Expanding your shell knowledge
subtitle: Ways to up your knowledge of the shell and become faster at using it
date: 2022-04-06
---

For a time I was satisfied knowing just the commonly used shell commands like `rm`, `ls`, `cat` and other things like the fact that every shell has `stdin`, `stdout` and `stderr` connected to the terminal by default. As time went on I wanted to know more about what can be done from the command-line interface. While learning more I sadly realized I don't even have a good enough grasp of the basics, at first I thought this was the imposter syndrome, but then I gave the famous [Unix Programming Environment](https://www.amazon.com/Unix-Programming-Environment-Prentice-Hall-Software/dp/013937681X) book a read and I was convinced that no, I didn't experience any imposter syndrome, I definitely lacked the basics. Although the book is from 1984, it has truly stood the test of time, a lot of the statements made in there are still valid today, apart from that it also felt like a nice history lesson.

Now, after gaining more knowledge, I thought I would compile a list of good things to know about the shell for those of us who use the command-line interface often. These are things I have learned throughout my so far short software development career that have definitely improved my knowledge. As a disclaimer, `zsh` is the shell that I use so the things I am going to talk about may not be valid across all shells.


## History expansion

To be honest with you, I didn't know these type of commands were called like this until I started writing this article. These commands act on the history of commands executed, hence the name. In order to better understand the concepts we're going to talk about, we will often refer to the below output from the `history` command:

```
$ history
5  git add ../package.json ../package-lock.json
6  git commit -m 'remove dependencies'
7  ls
8  clear
9  git status
10  git push
11  node -v
12  nvm use --lts
13  npm install lodash
```
The `history` command prints the last commands you have executed. Each line starts with a number, that is the number of the command run during the current shell session. For example, according to the output above, `ls` was the 7th command run. Keep in mind that at this point in time the last run command is `history`, so that would be the 14th command. A line from the `history` output is called an *event*, and the parts of that line are called *words*, this being said, there are *event* designators and *word* designators. I will only talk about event designators since I haven't used word designators that much. You can find out more about them by reading [GNU bash reference manual - history expansions](https://www.gnu.org/software/bash/manual/html_node/History-Interaction.html).
### Event designators

Using event designators, we can refer to previously run commands. If we want to refer to the 9th run command, we can do so by using the sequence of characters `!9`, which will be expanded into the 9th run command:

```
$ echo !9
echo git status
git status
```

The first line of output that is printed is the command that was actually run so you can see the substitution that was made. The second output line is the output of the command. What's more interesting is that we can use the reference to a command to run the command again, so if we want to run `git status` again we can enter `!9` into the terminal, which will expand to what we want:

```
$ !9
git status
On branch master
Your branch is up to date with 'origin/master'.
...
```

Just like earlier, the first line of output is the command that was run (`git status`), and the rest of the lines following that is the output of the command (`On branch master...`). Just so we don't get confused, I have put dots in the above block instead of pasting all the output produced by `git status`. As you can tell by now, history expansions are introduced by the exclamation mark `!` character, which is also called the history expansion character.

You can probably see that we are referencing to the past commands in an absolute manner (like with absolute paths) and you are probably wondering if you can refer to a command that was run `n` lines back. We can of course refer to a command in a relative manner using `!-n`, this will refer to the command that was run `n` lines back. For instance, if we want to refer to the third to last command, we can use `!-3` (same thing as `!12`) which in our case will expand to `nvm use --lts`. Don't forget the `history` command is the 14th one, that makes `nvm use --lts` the command that was run 3 lines back. 

To be frank, I can't remember the last time I used history expansions like in the examples above. Whenever I want to run again a previous run command I generally scroll up until I reach the command and enter, but let's not give up yet! Where this actually gets useful is if we want to refer to the last run command, we can do that using `!-1`. Imagine the following scenario: you've just run `npm install react` and you get an error saying you have insufficient permissions, prompting you to run the command as root. A naive way to run the command as root would be to scroll up and prepend the command with `sudo`, getting you to `sudo npm install react`. But now that you know how to refer to the last run command you can use `sudo !-1` instead, rendering you the exact same command. I think the authors observed `!-1` is so often used they aliased it to `!!`. This being said, you can shave off one extra character from `sudo !-1` by running `sudo !!`.

Another flavor of event designators is `!<string>`, this will refer to the most recent run command that starts with `<string>`. If you want to refer to a command that contains  a string, `!?<string>` can be used instead.

```
$ !node
node -v
v16.13.2
$ !?status
git status
On branch master
Your branch is up to date with 'origin/master'.
...
```

An alternative to this is to search through the history with `CTRL+R`. Once you press these two keys together, something like `bck-i-search: _` will appear in the terminal, now you can type a substring of the command you are looking for in the history.

## Shell expansions

Different kind of shell expansions exist, we will not talk about all of them. Like with history expansions, you can find out more on [GNU bash reference manual - shell expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html#Shell-Expansions).

### Variable expansion

After a line is entered, it is split into words and the words are expanded by the shell before being passed as arguments to commands, for example:

```
$ echo $PWD
/dev/fd
```

In certain scenarios, you might want to know what the arguments will expand to. If you press tab they will expand without being executed so you can see what kind of expansion happens and what arguments you will end up with. For example let's say we want to see what this argument to `cat` will expand to

```
$ cat $HOME/file.txt
```

Simply pressing tab will result in

```
$ cat /Users/michaelfrontend/file.txt
```

It even works when the argument to be processed is more complex

```
$ cat $HOME/Desktop/../file.txt
```

Pressing tab, we will get

```
$ cat /Users/michaelfrontend/file.txt
```

This example was kind of contrived but I hope you can see the value in previewing the final command before running it. Pressing tab to do this doesn't apply to variable expansion only, have a go at it with history expansions!

### Command substitution

Sometimes you might want arguments to be the output of commands. Command substitution does just that. It has two syntaxes: `` `<command>` `` and `$(<command>)`

```
$ introduction="You are reading an article on `whoami`.com"
$ echo $introduction
You are reading an article on michaelfrontend.com
$ introduction="You are reading an article on $(whoami).com"
$ echo $introduction
You are reading an article on michaelfrontend.com
```

### Process subtitution

This allows you to use a command where a file name would usually be expected. It essentially substitutes a process for a file, hence the name. The syntax is `<(<command>)`, where `<command>` is the command to be executed. We will illustrate it by diff-ing two small strings, remember that diff accepts paths to files as arguments.

```
$ diff <(echo 'hello there') <(echo 'hello you')
1c1
< hello there
---
> hello you
```

This actually came in handy a couple of times when I wanted to diff bigger strings. Without process substitution one would have to put the two strings in two distinct files and only then could diff. Behind the scenes there is some magic involving pipes, just for curiosity sake we will peek at it:

```
$ cat <(echo hello) 
hello
$ echo <(echo hello)
/dev/fd/11
```

We know that `cat` takes as arguments paths to files, so in this case we expect it to receive a path to a file. This is indeed true as seen by what `echo` returns. We can mentally simplify how process substitution works by thinking the process' output is written to a normal file and the path to that file is returned.

## Executing and sourcing a script

We have the file `script.sh` and its contents:
```
echo hello there
```

Ever thought if there is any difference between these two types of running a script?

```
$ ./script.sh
hello there
$ source script.sh
hello there
```

In this case we get the same output so we can say they are identical. But what is really happening underneath is that when we execute the script (like `./script.sh`) a child process is created where `script.sh` is run. This child process will have a different execution environment so changes in it will not be reflected back in the parent process. Once the contents of the script have been evaluated, the child process returns whatever the script wrote to standard output back to its parent process. In contrast, running the script using `source` executes the commands from `script.sh` in the current execution environment, meaning whatever changes `script.sh` is gonna do, they will be reflected in the current shell (e.g. directory change by `cd`). Imagine you would copy, paste and run the commands one by one from `script.sh` at the command line, that is what sourcing essentially means. We can prove that a new process is created when executing a shell script by examining the process ID of the current shell. Let's take `script2.sh` with its contents:

```
echo $$
```

`$$` is a variable that holds the process ID of the current shell. Now, in order to prove that `source` runs the commands from a script in the current shell, the output of `source script2.sh` should be the same as `echo $$`. Executing the script (`./script2.sh`) creates another process, which means a distinct process ID. As expected, we can see that is true:

```
$ echo $$    
77790
$ source script2.sh
77790
$ ./script2.sh
63908
```

By sourcing a script we can alter the variables of the current shell, something that can't be done by simply executing the script. For example, let's take the contents of `script3.sh`:

```
var=50
```

Initially, the value of `var` is undefined. We can see that by executing `script3.sh` the value of `var` doesn't change in the current shell. However, if we source it, the value of `var` changes in the current shell.

```
$ echo $var

$ ./script3.sh
$ echo $var

$ source script3.sh
$ echo $var
50
```

One instance in the real world where sourcing a script is used is for creating a [python virtual environment](https://docs.python.org/3/library/venv.html), changes have to be done to the `PATH` variable in order to create the virtual environment, so sourcing a script it is the way to go.

By the way, `source` is a bashism (a shell command specific to the bash interpreter). `.` is an alias to `source` and `.` should be used instead because it goes along with the POSIX specification. The reason I didn't use `.` in the examples above is because `source` is easier to refer to, also `.` could be confused with the other `.` which stands for the current directory.


## Grouping commands

If you want to run commands in a sub-shell (child process) you have to create a script and execute the script file, just like we have seen in the examples above. Instead of creating a sometimes unnecessary file, one can make use of something called command grouping. It has the syntax `( <command-list> )`, where `<command-list>` is a list of commands to be run. Let's test that these commands are run in a sub-shell by altering the value of a variable inside the sub-shell and `echo`ing it in the current shell.

```
$ var=200
$ echo $var
200
$ ( var=0 )
$ echo $var
200
```

As we can see, the value of `var` remains the same before and after running `( var=0 )`, this means the `var=0` assignment has been run in a different process, with a different execution environment compared to the parent process.

An interesting example of running commands in a sub-shell by using command grouping would be:

```
$ ls
dir1 dir2 
$ ( cd dir1; echo $PWD ); ( cd dir2; echo $PWD )
/Users/michaelfrontend/test-directory/dir1
/Users/michaelfrontend/test-directory/dir2
```

The `;` between commands makes the commands execute sequentially, that is `( cd dir2; echo $PWD )` is run only after `( cd dir1; echo $PWD )` has finished running, the same thing happens for the `echo` and `cd` commands. Because the execution environment of the sub-shells is different to that of the current process (the parent process), `cd` doesn't alter the current working directory in the current process. The above way of printing `$PWD` in each directory is, in my opinion, easier to understand than:

```
$ ls
dir1 dir2
$ cd dir1; echo $PWD
/Users/michaelfrontend/test-directory/dir1
$ cd ../dir2; echo $PWD
/Users/michaelfrontend/test-directory/dir2
```

This example is kind of contrived as well, but imagine that instead of printing the working directory you would do other kind of computations.

Another form of command grouping is `{ <command-list> }`, which is the same as the command grouping above but with curly brackets instead of round brackets. When the commands are within curly brackets, they are executed in the current shell. So basically `{ <command-list> }` should have the same result as `<command-list>` alone.

## Export command

Variables are scoped to the current shell unless specified otherwise. If you want variables to be available in the sub-shells with a different execution environment (e.g. script files), then you have to mark them with the `export` command.

```
$ echo 'echo value of var is $var' > script4.sh
$ var=5
$ ./script4.sh
value of var is
$ export var
$ ./script4.sh
value of var is 5
```

As seen above, a script that is executed doesn't get the same execution environment as the parent. Variables don't need to be exported if commands are to be run within a sub-shell created by `(...)`. In this case the sub-shell created with parantheses will get an execution environment that is a duplicate of the parent's execution environment.

## Single vs double quotes

If you're coming from a JavaScript or Python background, you would think the single and double quotes are no different when using them in the shell, this is what I thought for a long time at least. Later it struck me that within single quotes no interpolation is done, while that happens within double quotes.

```
$ WEBSITE=michaelfrontend.com
$ echo 'You are on $WEBSITE'
You are on $WEBSITE
$ echo "You are on $WEBSITE"
You are on michaelfrontend.com
```

## cd -

This is a short but quick way to switch back to the previous directory you were in, just use `cd -`.

```
$ cd ~
$ pwd
/Users/michaelfrontend
$ cd Desktop/
$ pwd
/Users/michaelfrontend/Desktop
$ cd - 
~
$ pwd
/Users/michaelfrontend
```

That's about it. Thank you for reading this article!