const o=1,t="First Commit",e="Save the collapsing system with your first Git commit",i=[{id:"cinematic-intro",type:"cinematic",duration:3e4,nextStep:"terminal-init"},{id:"terminal-init",type:"terminal",title:"Initialize Repository",initialOutput:[{type:"output",text:"System has no memory. No way to record changes."},{type:"output",text:""},{type:"info",text:"Type the command that creates a repository — our foundation."},{type:"output",text:""}],expectedCommand:"git init",commandPattern:"^git init$",suggestions:[{command:"git init",hint:"Initialize the repository"}],successOutput:[{type:"success",text:"Initialized empty Git repository in /project/.git/"},{type:"output",text:""},{type:"success",text:"Good. We now have a heartbeat."},{type:"output",text:""}],errorOutput:[{type:"error",text:"Think: we need to create the time machine first."},{type:"output",text:"Hint: Type 'git init' to initialize a repository."},{type:"output",text:""}],visualEvent:"timeline.initialize",soundEvent:"commit",nextStep:"concept-git-init"},{id:"concept-git-init",type:"concept",conceptId:"git init",autoShow:!0,nextStep:"file-appears"},{id:"file-appears",type:"dialog",speaker:"Keif-X",text:"Fix this broken function. The entire city depends on it.",speakerType:"character",nextStep:"editor-fix"},{id:"editor-fix",type:"editor",file:"main.py",initialContent:`def calculate_sum(a, b):
    """
    Calculate the sum of two numbers.
    
    Args:
        a: First number
        b: Second number
    
    Returns:
        The sum of a and b
    """
    # TODO: Fix this critical bug - function returns wrong value!
    # The system is crashing because of this calculation error
    result = a - b  # BUG: Should be addition, not subtraction!
    return result

# Test cases:
# calculate_sum(5, 3) should return 8, but currently returns 2
# calculate_sum(10, 7) should return 17, but currently returns 3
# This bug is causing system instability!`,readonly:!1,expectedFix:"Fix the calculation - change subtraction to addition",hint:"Change the minus sign (-) to a plus sign (+) on line 3",nextStep:"terminal-stage"},{id:"terminal-stage",type:"terminal",title:"Stage Changes",initialOutput:[{type:"output",text:"Now stage your changes. Tell Git what to save."},{type:"output",text:""}],expectedCommand:"git add .",commandPattern:"^git add",suggestions:[{command:"git add .",hint:"Stage all changes"},{command:"git add main.c",hint:"Stage the specific file"}],successOutput:[{type:"success",text:"Changes staged for commit"},{type:"output",text:""}],errorOutput:[{type:"error",text:"Use 'git add .' to stage all changes, or 'git add <file>' for a specific file."},{type:"output",text:""}],visualEvent:"timeline.stage",soundEvent:"success",nextStep:"concept-git-add"},{id:"concept-git-add",type:"concept",conceptId:"git add",autoShow:!0,nextStep:"terminal-commit"},{id:"terminal-commit",type:"terminal",title:"Create Commit",initialOutput:[{type:"output",text:"Now commit. Make this moment permanent."},{type:"output",text:""}],expectedCommand:"git commit",commandPattern:"^git commit",suggestions:[{command:'git commit -m "Fix system crash"',hint:"Create your first commit"}],successOutput:[{type:"success",text:"[main (root-commit) a1b2c3d] Fix system crash"},{type:"output",text:" 1 file changed, 5 insertions(+), 1 deletion(-)"},{type:"output",text:" create mode 100644 main.c"},{type:"output",text:""},{type:"success",text:"STABILITY RESTORED — at 4%"},{type:"output",text:""}],errorOutput:[{type:"error",text:`Use 'git commit -m "your message"' to create a commit with a message.`},{type:"output",text:""}],visualEvent:"timeline.addCommit",visualData:{commitId:"a1b2c3d",message:"Fix system crash"},soundEvent:"commit",nextStep:"commit-celebration"},{id:"commit-celebration",type:"dialog",speaker:"Keif-X",text:"Remember this moment. A commit is not just code — it's a promise.",speakerType:"character",nextStep:"concept-git-commit"},{id:"concept-git-commit",type:"concept",conceptId:"git commit",autoShow:!0,nextStep:"act2-transition"},{id:"act2-transition",type:"dialog",speaker:"BugLord",text:"You think one commit will stop me?",speakerType:"character",nextStep:"complete"},{id:"complete",type:"complete",message:"Act 1 Complete! You've saved the system with your first commit. The chaos grows, but so does your power.",nextAct:2}],n={timeline:{initialState:"empty",states:{empty:{message:"No repository yet",hint:"Run git init to get started"},initialized:{message:"Repository initialized",hint:"Stage and commit your changes"},committed:{commitId:"a1b2c3d",message:"Fix system crash"}}},editor:{file:"main.c",initialContent:`// CRITICAL SYSTEM FUNCTION
void stabilizeSystem() {
    // TODO: Fix this - system crashes here
    int* ptr = NULL;
    *ptr = 42;  // SEGFAULT!
    return;
}`,readonly:!1}},a={actId:1,title:t,description:e,steps:i,visualizations:n};export{o as actId,a as default,e as description,i as steps,t as title,n as visualizations};
