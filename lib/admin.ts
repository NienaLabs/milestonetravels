// Email whitelist — used only as a fallback during initial setup
// before the admin manually sets a role in the database.
const ADMIN_EMAILS = [
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map(e => e.trim().toLowerCase()) : [])
];

/**
 * Checks whether a session user has admin access.
 * Primary check: user.role === "admin" (stored in the database).
 * Fallback: email whitelist via ADMIN_EMAILS env var.
 */
export function isAdmin(
  emailOrUser: string | null | undefined | { email?: string | null; role?: string | null }
): boolean {
  if (!emailOrUser) return false;

  // Object form (pass session.user directly)
  if (typeof emailOrUser === "object") {
    if (emailOrUser.role?.toUpperCase() === "ADMIN") return true;
    return ADMIN_EMAILS.includes((emailOrUser.email ?? "").toLowerCase());
  }

  // String form (just an email)
  return ADMIN_EMAILS.includes(emailOrUser.toLowerCase());
}
