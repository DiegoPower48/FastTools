import { useState } from "react";
import Rest from "./rest";
import Websocket from "./websocket";
import { IconBrandSocketIo } from "@tabler/icons-react";
export default function ApiTester({ theme, textTheme, api, setApi }) {
  const [modo, setModo] = useState("rest");
  return (
    <div
      style={{
        border: `2px solid ${theme}`,
        color: textTheme,
      }}
      className=" h-full overflow-hidden flex flex-col items-center justify-start w-full rounded-xl shadow-xl"
    >
      <div
        style={{
          backgroundColor: theme,
        }}
        className={`relative min-h-14 items-center justify-center md:grid grid-cols-6 md:grid-rows-1 flex w-full`}
      >
        <div className="md:col-start-1 md:col-end-4 text-xl  w-full font-bold uppercase flex justify-center items-center">
          API TESTER
        </div>
        <div className="md:col-start-4 md:col-end-7 flex justify-center items-center gap-4">
          <div
            style={{
              backgroundColor: modo === "rest" && "white",
              color: textTheme,
              boxShadow: modo === "rest" && `0px 0px 5px 1px white`,
            }}
            className={`flex p-2 rounded ${
              modo != "rest" ? "border-white" : "border-black"
            } border-2 font-bold items-center justify-center gap-2 hover:opacity-70`}
            onClick={() => setModo("rest")}
          >
            <div>HTTP</div>
          </div>
          <div
            style={{
              backgroundColor: modo === "websocket" && "white",
              color: textTheme,
              boxShadow: modo === "websocket" && `0px 0px 5px 1px white  `,
            }}
            className={`flex p-2 rounded font-bold  ${
              modo != "websocket" ? "border-white" : "border-black"
            } border-2 items-center justify-center gap-2 hover:opacity-70`}
            onClick={() => setModo("websocket")}
          >
            <div>WEBSOCKET </div>
            <IconBrandSocketIo />
          </div>
        </div>
      </div>
      {modo === "rest" ? (
        <Rest theme={theme} textTheme={textTheme} api={api} setApi={setApi} />
      ) : (
        <Websocket theme={theme} textTheme={textTheme} />
      )}
    </div>
  );
}
