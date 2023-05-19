import { Link } from "react-router-dom";
import "../styles.css";
function Home({ loggedin }) {
  return (
    <div className="jumbotron centered">
      <div className="container">
        <i className="fas fa-key fa-6x"></i>
        <h1 className="display-3" style={{ fontWeight: "400" }}>
          Country Quiz
        </h1>
        <p className="lead" style={{ fontWeight: "400" }}>
          Jump into the mystery map and let the adventure begin!
        </p>
        <hr />
        {
          loggedin ? (
          <Link to="/play" className="btn btn-dark btn-lg">
            Enter
          </Link>
        ) : (
          <>
            <Link to="/signup" className="btn btn-light btn-lg">
              Register
            </Link>
            <Link to="/login" className="btn btn-dark btn-lg">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
