import React from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "./Navigation/NavigationBar";
function RouteLayout() {
  return (
    <div>
      <div className="content-container">
        <NavigationBar />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default RouteLayout;
