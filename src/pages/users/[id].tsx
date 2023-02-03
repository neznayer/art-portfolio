import { signIn, signOut, useSession } from "next-auth/react";

const User = () => {
  const { data: session } = useSession();

  if (!session) {
    // Handle unauthenticated state, e.g. render a SignIn component
    return (
      <>
        <button onClick={() => signIn("google")}>SignIn</button>
      </>
    );
  }

  return <p>Welcome {session.user.name}!</p>;
};

export default User;
