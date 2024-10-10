import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const Error = () => {
  const err = useRouteError();

  if (isRouteErrorResponse(err)) {
    return (
      <div>
        Oops something went wrong!!
        <h2>
          {err.status} : The Page you are lookiing for doesn&apos;t exists
        </h2>
      </div>
    );
  }
};

export default Error;
