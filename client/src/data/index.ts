import { ILoginInput, IRegisterInput } from "../interfaces";

export const REGISTER_FORM: IRegisterInput[] = [
  {
    name: "username",
    type: "text",
    placeholder: "Username",
    //before use validation schemaa
    //validation: { required: true, minLength: 5 },
  },
  {
    name: "email",
    placeholder: "Email",
    type: "email",
    //before use validation schemaa
    // validation: {
    //   required: true,
    //   pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    // },
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
    //before use validation schemaa
    // validation: {
    //   required: true,
    //   minLength: 6,
    // },
  },
];

export const LOCIN_FORM: ILoginInput[] = [
  {
    name: "identifier",
    placeholder: "Email",
    type: "email",
    //before use validation schemaa
    // validation: {
    //   required: true,
    //   pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    // },
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
    //before use validation schemaa
    // validation: {
    //   required: true,
    //   minLength: 6,
    // },
  },
];

// export const LOGIN_FORM: ILoginInput[] = [
//   {
//     name: "identifier",
//     placeholder: "Email",
//     type: "email",
//     validation: {
//       required: true,
//       pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
//     },
//   },
//   {
//     name: "password",
//     placeholder: "Password",
//     type: "password",
//     validation: {
//       required: true,
//       minLength: 6,
//     },
//   },
// ];
