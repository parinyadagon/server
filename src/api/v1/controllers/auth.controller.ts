import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promises as fsPromises } from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

interface UserDB {
  users: any[];
  setUsers: (data: User[]) => void;
}

const usersDB: UserDB = {
  users: require("../../mock/users.json"),
  setUsers: function (data: any[]) {
    this.users = data;
  },
};

interface User {
  username: string;
  password: string;
  roles: {
    admin: boolean;
    user: boolean;
  };
  refreshToken: string;
}

const ACCESS_TOKEN_SECRET: string | undefined =
  process.env.ACCESS_TOKEN_SECRET || "sdfsdfsdfsdf";
const REFRESH_TOKEN_SECRET: string | undefined =
  process.env.REFRESH_TOKEN_SECRET || "sdfsdfsd163546";

const handleLogin = async (req: Request, res: Response) => {
  const { user, pwd }: { user: string; pwd: string } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  const foundUser = usersDB.users.find(
    (person: User) => person.username === user
  );
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    const otherUsers = usersDB.users.filter(
      (person: User) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "../..", "mock", "users.json"),
      JSON.stringify(usersDB.users)
    );

    const currentUserClone: {
      username: string;
      role: object;
      refreshToken?: string;
      password?: string;
    } = {
      ...currentUser,
    };

    delete currentUserClone.refreshToken;
    delete currentUserClone.password;

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken, ...currentUserClone });
  } else {
    res.sendStatus(401);
  }
};

export default { handleLogin };
