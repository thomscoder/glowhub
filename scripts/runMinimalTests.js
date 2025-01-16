import simpleGit from "simple-git";
import { execSync } from "child_process";

const git = simpleGit();

const getChangedFilesFromPR = async (branches) => {
  let [baseBranch, featureBranch] = branches;
  if (!baseBranch || !featureBranch) {
    console.log(`
      ❌ WRONG SCRIPT.. (missing branches names)

      The script should be yarn test:minimal:pr BASE_BRANCH FEATURE_BRANCH
      for example for a pr pointing to develop

      👉 yarn test:minimal:pr develop featureBranchName

      for a pr pointing to staging

      👉 yarn test:minimal:pr hot-fix featureBranchName
      `);
    process.exit(0);
  }
  try {
    await git.fetch("origin");
    if (featureBranch === ".") {
      featureBranch = await git.revparse(["--abbrev-ref", "HEAD"]);
    }

    // Get the list of all local branches
    const branches = await git.branch(["-r"]);
    const localBranches = branches.all;

    if (!localBranches.includes(`origin/${featureBranch}`)) {
      console.log(
        `Branch '${featureBranch}' does not exist locally. Fetching from remote...`
      );
      await git.fetch("origin", featureBranch);
      console.log(`Fetched branch '${featureBranch}' from remote.`);
    } else {
      console.log(`Branch '${featureBranch}' found...`);
    }

    // Fetch the latest changes for the base branch to ensure it's up-to-date
    await git.fetch("origin", baseBranch);

    const changedFiles = await git.diff([
      "--name-only",
      `origin/${baseBranch}...origin/${featureBranch}`,
    ]);

    const fileList = changedFiles
      .split("\n")
      .filter(
        (file) =>
          file.endsWith(".js") ||
          file.endsWith(".ts") ||
          file.endsWith(".jsx") ||
          file.endsWith(".tsx")
      )
      .map((file) => file.replace("givesync-merchant/", ""));

    if (fileList.length === 0) {
      console.log("No changed JavaScript/TypeScript files found.");
      return;
    }

    const command = `pnpm test ${fileList.join(
      " "
    )}`;
    console.log(`Running: ${command}`);

    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error("Error running tests:", error);
    process.exit(1);
  }
};

getChangedFilesFromPR(process.argv.splice(2));
