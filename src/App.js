import logo from "./logo.svg";
import "./App.css";
import FirstFloor from "./pages/FirstFloor/FirstFloor";
import SecondFloor from "./pages/SecondFloor/SecondFloor";
import ThirdFloor from "./pages/ThirdFloor/ThirdFloor";
import Allocation from "./pages/Allocation/Allocation";
import DetailsPage from "./pages/DetailsPage";
import All from "./pages/All/All";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RouteLayout from "./pages/RootLayout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RouteLayout />,
      children: [
        {
          path: "/",
          element: <FirstFloor />,
        },
        {
          path: "/2",
          element: <SecondFloor />,
        },
        {
          path: "/3",
          element: <ThirdFloor />,
        },
        {
          path: "/allocation",
          element: <Allocation />,
        },
        {
          path: "/all",
          element: <All />,
        },
        {
          path: "/details/:id",
          element: <DetailsPage />,
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
