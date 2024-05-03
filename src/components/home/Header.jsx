import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { columnDisplayHandler } from "../../features/columnSlice";
import { handleMenu } from "../../features/settingsSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../features/loginSlice";

const Header = () => {
  const columns = useSelector((state) => state.columns.columns);
  const dispatch = useDispatch();
  const style = useSelector((state) => state.settings.header);
  const logoSize = style.logoSize;
  const headerSize = style.headerSize;
  const headerColor = style.headerColor;
  const textSize = style.textSize;
  const textColor = style.textColor;
  const wordSpace = style.wordSpace;
  const myAccount = JSON.parse(localStorage.getItem("userAccount"));
  const [signOut, setSignOut] = useState(false);
  const navigate = useNavigate();

  const tasks = useSelector((state) => state.tasks.tasks);
  let done = 0;
  let other = 0;

  tasks.forEach((task) => {
    task.columnName === "Done" ? done++ : other++;
  });

  const progressStyle = {
    position: "absolute",
    width: textSize ? textSize * 1.5 + "px" : "27px",
    height: textSize ? textSize * 1.5 + "px" : "27px",
    clipPath: "circle()",
    transform: "translate(-120%, -90%)",
    background: `conic-gradient(${textColor || "#000"} 0 ${
      (done / tasks.length) * 100
    }%, #bbb ${(done / tasks.length) * 100}% ${
      (done / tasks.length) * 100 + other
    }%)`,
  };

  const headerStyle = {
    height: headerSize ? headerSize + "px" : "unset",
    background: headerColor || "#ddd",
  };

  const headerTextStyle = {
    fontSize: textSize ? textSize + "px" : "18px",
    color: textColor,
  };

  const handleSignout = () => {
    localStorage.removeItem("userAccount");
    delete localStorage.isLogedin;
    dispatch(handleLogout());
    navigate("/login");
  };

  return (
    <header>
      <nav style={headerStyle}>
        <div>
          <img
            src="/src/images/logo.png"
            alt="Logo"
            style={{ width: logoSize ? logoSize + "px" : "83px" }}
          />
          <NavLink to="/taskList">
            <p>Task Listt</p>
          </NavLink>
        </div>
        <ul style={{ gap: wordSpace ? wordSpace + "px" : "5px" }}>
          <li
            style={headerTextStyle}
            onClick={() => dispatch(columnDisplayHandler(null))}
          >
            Show all
          </li>
          {columns.map((column, index) => (
            <li
              style={headerTextStyle}
              key={index}
              onClick={() => dispatch(columnDisplayHandler(column))}
            >
              {column}
            </li>
          ))}
          <li
            style={headerTextStyle}
            onClick={() => dispatch(columnDisplayHandler("Done"))}
          >
            Done
          </li>
        </ul>
        <div id="headerLeft">
          <a>
            <p style={headerTextStyle}>Progress</p>
            <div style={progressStyle}>
              <div
                id="progressInnerCircle"
                style={{
                  background: headerColor || "#ddd",
                  width: "70%",
                  height: "70%",
                }}
              ></div>
            </div>
          </a>
          {signOut && <button onClick={handleSignout}>Sign-out</button>}
          {!myAccount ? (
            <NavLink to="/login">
              <p style={headerTextStyle}>
                <i className="fas fa-user-alt"></i>
              </p>
            </NavLink>
          ) : (
            <img
              id="userImage"
              src={myAccount[0].imageUrl}
              alt="User"
              onClick={() => setSignOut(!signOut)}
            />
          )}
          <NavLink to="/about">
            <p style={headerTextStyle}>About</p>
          </NavLink>
          <NavLink to="/admin">
            <p style={headerTextStyle}>
              Admin <i className="fas fa-users-cog"></i>
            </p>
          </NavLink>
          <div
            id="navSetting"
            title="Settings"
            onClick={() => dispatch(handleMenu(true))}
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
