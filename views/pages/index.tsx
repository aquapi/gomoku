import Base from "../layouts/base";

export default () => (
  <Base
    title="Gomoku"
    description="A simple board game"
    styleHref="/styles/index.css"
  >
    <h1>Gomoku</h1>
    <form action="/room">
      <input name="id" placeholder="Enter a room name..." class="ui-effect" />
      <button type="submit" class="ui-effect">
        Join
      </button>
    </form>
  </Base>
);
