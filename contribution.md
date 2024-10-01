# Contributor's Guide

'HOW TO CONTRIBUTE TO OPEN SOURCE' accepts PR's (pull requests) from **newbies**
only. This is to help **newbies** get familiar with the contribution processes.

Issues can be submitted by anyone - either seasoned developers or newbies.

**Contents**

- [Choosing an Issue](#choosing-an-issue)
- [Getting Started](#getting-started)
- [Submitting a Pull Request](#submitting-a-pull-request)

## Choosing an Issue

Before getting started and setup with contributing, you'll want to look at and choose an issue to work on. Here is a basic workflow you want to work from:

1. Search through issues
2. Find issue you want to work on
3. Check if someone else has already worked on and made a pull request on said issue
4. (Optional) Double check pull requests for someone who has worked on the pull request

If you have gotten that far, then you can go ahead and work on the issue. Below are more detailed instructions based on the basic workflow above.

You can find open issue [here](https://github.com/yesahem/Medium-Blog/issues).

Once you've found an issue you want to work on, take a look at the issue to see if anyone else has made a pull request for this issue yet.

You can tell if someone has correctly referenced and worked on an issue if in the issue you find some text saying, the following:

>  This was referenced on ____

where that `____` is the date and below it is the pull request of another individual working on that issue. [Here](https://github.com/yesahem/Medium-Blog/issues/13) is an example of what this looks like.

To be extra sure no one has worked on it, you can [take a look at the pull requests](https://github.com/yesahem/Medium-Blog/pulls) as well to see if anyone has made a similar pull request.

If you've gotten this far, then you can continue on with the next section on "Getting Started" to working on your first pull request and contribution to our repository.

### Getting Started

1.  If you are new to Git and GitHub, it is advisable that you go through
    [GitHub For Beginners](http://readwrite.com/2013/09/30/understanding-github-a-journey-for-beginners-part-1/)
    **before** moving to Step 2.

2.  Fork the project on GitHub.
    [Help Guide to Fork a Repository](https://help.github.com/en/articles/fork-a-repo/).

    ![Illustration for How to Fork a Repository](https://hisham.hm/img/posts/github-fork.png)

3.  Clone the project.
    [Help Guide to Clone a Repository](https://help.github.com/en/articles/cloning-a-repository)

4.  Create a branch specific to the issue you are working on.

    ```shell
    git checkout -b update-readme-file
    ```

    For clarity, name
    your branch `update-xxx` or `fix-xxx`. The `xxx` is a short
    description of the changes you're making. Examples include `update-readme` or
    `fix-typo-on-contribution-md`.

5.  Open up the project in your favorite text editor, select the file you want
    to contribute to, and make your changes.

    If you are making changes to the `README.md` file, you would need to have
    Markdown knowledge. Visit
    [here to read about GitHub Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
    and
    [here to practice](http://www.markdowntutorial.com/).

    *   If you are adding a new project/organization to the README, make sure
        it's listed in alphabetical order.
    *   If you are adding a new organization, make sure you add an organization
        label to the organization name. This would help distinguish projects
        from organizations.

6.  Add your modified
    files to Git, [How to Add, Commit, Push, and Go](http://readwrite.com/2013/10/02/github-for-beginners-part-2/).

    ```shell
    git add path/to/filename.ext
    ```

    You can also add all unstaged files using:

    ```shell
    git add .
    ```

    **Note:** using a `git add .` will automatically add all files. You can do a
    `git status` to see your changes, but do it **before** `git add`.

6.  Commit your changes using a descriptive commit message.

    ```shell
    git commit -m "Brief Description of Commit"
    ```

7.  Push your commits to your GitHub Fork:

    ```shell
    git push -u origin branch-name
    ```

8.  Submit a pull request.

    Within GitHub, visit this main repository and you should see a banner
    suggesting that you make a pull request. While you're writing up the pull
    request, you can add `Closes #XXX` in the message body where `#XXX` is the
    issue you're fixing. Therefore, an example would be `Closes #42` would close issue
    `#42`.

### Submitting a Pull Request

[What is a Pull Request?](https://yangsu.github.io/pull-request-tutorial/)

If you decide to fix an issue, it's advisable to check the comment thread to see if there's somebody already working on a fix. If no one is working on it, kindly leave a comment stating that you intend to work on it. By doing that,
other people don't accidentally duplicate your effort.

In a situation where somebody decides to fix an issue but doesn't follow up
for a particular period of time, say 2-3 weeks, it's acceptable to still pick
up the issue but make sure that you leave a comment.

*Note*: Every open-source project has a **CONTRIBUTING.md** file, please make
sure to read this before you open up a pull request; otherwise, it may be
rejected. However, if you do not see any CONTRIBUTING.md file, you can send a
pull request but do it in a descriptive manner.
