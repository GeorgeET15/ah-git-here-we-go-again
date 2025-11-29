import { CommandContext, CommandResult } from "./commandEngine";

/**
 * Validation rules for commands
 */
export interface ValidationRule {
  name: string;
  validate: (command: string, context: CommandContext) => boolean;
  errorMessage: string;
}

/**
 * Check if command matches expected pattern
 */
export const validateCommandPattern = (
  command: string,
  expectedPattern: string | RegExp
): boolean => {
  if (typeof expectedPattern === "string") {
    return command.trim() === expectedPattern;
  }
  return expectedPattern.test(command.trim());
};

/**
 * Check if command is valid for current step
 */
export const validateStep = (
  command: string,
  context: CommandContext,
  allowedSteps: string[]
): boolean => {
  return allowedSteps.includes(context.step);
};

/**
 * Common validation rules
 */
export const commonValidationRules: ValidationRule[] = [
  {
    name: "non-empty",
    validate: (command) => command.trim().length > 0,
    errorMessage: "Command cannot be empty",
  },
  {
    name: "git-prefix",
    validate: (command) => {
      const trimmed = command.trim();
      return trimmed.startsWith("git ") || trimmed === "git";
    },
    errorMessage: "Commands should start with 'git '",
  },
];

/**
 * Validate command against rules
 */
export const validateCommand = (
  command: string,
  context: CommandContext,
  rules: ValidationRule[]
): CommandResult | null => {
  for (const rule of rules) {
    if (!rule.validate(command, context)) {
      return {
        success: false,
        message: rule.errorMessage,
        lines: [
          { type: "error", text: `> error: ${rule.errorMessage}` },
          { type: "output", text: "" },
        ],
      };
    }
  }
  return null;
};


