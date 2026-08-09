export interface TerminalCommand {
  id: string;
  desc: string;
}

export const TERMINAL_COMMANDS: TerminalCommand[] = [
  { id: "help", desc: "show this list" },
  { id: "whoami", desc: "about me" },
  { id: "about", desc: "profile & focus areas" },
  { id: "projects", desc: "list projects" },
  { id: "projects <slug>", desc: "project detail" },
  { id: "research", desc: "thesis & research archive" },
  { id: "skills", desc: "the engineer network" },
  { id: "timeline", desc: "education & career" },
  { id: "contact", desc: "contact details" },
  { id: "clear", desc: "clear the screen" },
  { id: "exit", desc: "close the terminal" },
];
