<template>
  <section>
    <svg
      style="position: absolute"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <path
        fill="#7957d5"
        fill-opacity="1"
        d="M0,32L26.7,64C53.3,96,107,160,160,160C213.3,160,267,96,320,80C373.3,64,427,96,480,117.3C533.3,139,587,149,640,144C693.3,139,747,117,800,90.7C853.3,64,907,32,960,69.3C1013.3,107,1067,213,1120,229.3C1173.3,245,1227,171,1280,144C1333.3,117,1387,139,1413,149.3L1440,160L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"
      ></path>
    </svg>
    <div class="section container" style="position: relative">
      <div class="columns box">
        <div class="column">
          <div
            class="container is-max-desktop has-text-centered"
            style="margin-top: 72px"
          >
            <h1 class="is-size-4 has-text-weight-bold has-text-primary">
              Eliminate boring parts of software development
            </h1>
            <p class="mt-2">
              Tired of writing same auth, CRUD, over and over? Generate boring
              parts of your software and save time and money
            </p>
            <div class="mb-6 mt-5 buttons is-centered">
              <template v-if="!user">
                <b-button tag="router-link" to="/register" type="is-primary"
                  >Try now</b-button
                >
                <b-button tag="router-link" to="/login" type="is-secondary"
                  >Login</b-button
                >
              </template>
              <b-button
                v-else
                tag="router-link"
                to="/dashboard"
                type="is-primary"
                >Dashboard</b-button
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
        </div>
      </div>

      <div class="column is-12 is-6-desktop mx-auto has-text-centered">
        <h2 class="mb-4 mt-5 is-size-2 is-size-3-mobile has-text-weight-bold">
          Features
        </h2>
      </div>

      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img
                  src="@/assets/images/fast.webp"
                  alt="Light trails on fast road"
                />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Fast builds</p>
              <div class="content">
                No need to wait for days to prototype an idea into reality. Just
                input your requirements and we will build it for you really
                fast.
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img src="@/assets/images/time.webp" alt="Wristwatch" />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Instant Preview</p>
              <div class="content">
                Play with your project right here, no need of dealing with a
                server. Quickly reiterate and improve your software.
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img
                  src="@/assets/images/programmer.webp"
                  alt="Programmer writing some code in dark room"
                />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Built for Humans</p>
              <div class="content">
                We generate code that is easy to read and understand, it is
                optimized for humans and machines.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img
                  src="@/assets/images/servers.webp"
                  alt="Servers stack with network cables"
                />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Multiple DB Support</p>
              <div class="content">
                We support MySQL, PostgreSQL, SQLite, MSSQL &amp; Oracle DB. You
                can use multiple DB and even change database completely.
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img
                  src="@/assets/images/money.webp"
                  alt="Lot's of colorful notes"
                />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Affordable Pricing</p>
              <div class="content">
                Prices that doesn't make a hole in your wallet, our services
                costs you less than that of 1 hour of a good freelancer.
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img
                  src="@/assets/images/security.webp"
                  alt="A lock with keyboard keys"
                />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Ultimate Security</p>
              <div class="content">
                We carefully follow OWASP and generate code that is secure with
                proper authentication and authorization in place.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img
                  src="@/assets/images/guidance.webp"
                  alt="Two people discussing about something"
                />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Rich Coding Experience</p>
              <div class="content">
                We generate linters, pre commit hooks, unit test, server
                configs, editor extensions recommendation for great coding
                experience.
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img
                  src="@/assets/images/github.webp"
                  alt="github.com homepage on a monitor"
                />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Continuous Integration</p>
              <div class="content">
                Unit test with Github actions are generated so you can commit
                and relax with CI will ensure things are working.
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-image">
              <figure class="image is-square">
                <img
                  src="@/assets/images/planning.webp"
                  alt="People planning a project on sheets"
                />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-4">Always With You</p>
              <div class="content">
                We generate detailed README.md so you don't feel lost, it is
                always there to help you if you feel lost or need any
                assistance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",

  computed: mapState("auth", {
    user: (state) => state.user,
    token: (state) => state.token,

    currentRouteName() {
      return this.$route.name;
    },
  }),
};
</script>
