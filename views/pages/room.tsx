import Base from "../layouts/base";

export default () => (
  <Base
    title="Joining room..."
    description="Waiting for a player..."
    styleHref="/styles/room.css"
  >
    <p id="instant-dialog">Waiting for a player...</p>
    <main class="solid"></main>
    <script type="module" src="/scripts/room.js"></script>
  </Base>
);
