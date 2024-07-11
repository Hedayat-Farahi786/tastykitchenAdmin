import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";

const AuthLayout = () => {
  return (
    <main>
      <div className="authWrapper">
        <Container className="p-4" fluid>
          <Outlet />
        </Container>
      </div>
    </main>
  );
};

export default AuthLayout;
