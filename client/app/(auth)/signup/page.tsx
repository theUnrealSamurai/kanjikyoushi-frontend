import Link from "next/link";

export default function Signup() {
    return (
        <div className="flex flex-col min-h-screen bg-main-gray">
            <div className="text-2xl font-bold p-4">
            <div className="text-2xl font-bold p-4">
                <span className="text-main-red">T</span>
                <span className="text-white">Y</span>
                <span className="text-main-red">PE K</span>
                <span className="text-white">A</span>
                <span className="text-main-red">NJI</span>
            </div>
            </div>
            <div className="flex items-center justify-center flex-grow">
                <div className="flex flex-col border-2 text-white border-main-red h-fit w-96 rounded-2xl drop-shadow-lg shadow-white bg-[#453F3F]">
                    <div className="flex flex-col m-2">
                        <h1 className="font-bold text-3xl text-center mb-4">Sign Up!</h1>
                        <p className="ml-2">username</p>
                        <input type="text" className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray" placeholder="pick a username" />
                        <p className="ml-2">email</p>
                        <input type="email" className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray" placeholder="enter your email" />
                        <p className="ml-2">password</p>
                        <input type="password" className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray" placeholder="pick a password" />
                        <p className="ml-2">confirm password</p>
                        <input type="password" className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray" placeholder="confirm password" />
                        <button className="mx-2 mt-2 p-1 px-4 bg-main-red rounded-2xl font-bold">Sign Up</button>
                        <button className="m-2 p-1 px-4 bg-white text-black rounded-2xl font-bold">Sign Up with Google</button>
                        <p className="text-center mt-2">Already have an account? <Link href="/login/" className="text-main-red font-bold">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
