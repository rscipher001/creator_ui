<template>
  <section>
    <div
      class="container is-max-desktop has-text-centered"
      style="margin-top: 72px"
    >
      <h1 class="is-size-4 has-text-weight-bold has-text-primary">
        Email verification is pending
      </h1>
      <p class="mt-2">Please check your inbox or spam folder</p>
      <div class="mb-6 mt-3 buttons is-centered">
        <b-button tag="router-link" to="/register" type="is-primary"
          >Resend Verification Email</b-button
        >
      </div>
      <div>
        <img
          style="max-width: 480px"
          src="@/assets/programming.svg"
          alt="Programmer with code illustration"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Home",
};
</script>
