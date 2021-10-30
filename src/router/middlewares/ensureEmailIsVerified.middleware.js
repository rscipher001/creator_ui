export default function auth({ next, store }) {
  if (!store.auth.user.emailVerifiedAt) {
    return next({
      name: "EmailVerificationPending",
    });
  }
  return next();
}
