import Base from "../layouts/base";

export default () => (
  <Base
    title="Joining room..."
    description="Waiting for a player..."
    styleHref="/styles/index.css"
  >
    <h2 id="instant-dialog">Waiting for a player...</h2>
    <main class="solid"></main>
    <script type="module" src="/scripts/room.js"></script>
  </Base>
);
