const program = require("commander");

const helpOptions = () => {
  // 增加自己的options
  program.option("-z --zjt", "a zjt cli");
  program.option(
    "-d --dest <dest>",
    "a destination folder, 例如: -d /src/components"
  );

  program.on("--help", function () {
    console.log("");
    console.log("Others:");
    console.log("  other options~");
  });
};

module.exports = helpOptions;
