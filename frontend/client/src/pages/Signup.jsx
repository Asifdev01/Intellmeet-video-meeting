import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.name.trim().length < 2) {
            return setError("Please enter your full name (at least 2 characters).");
        }
        if (formData.password.length < 6) {
            return setError("Password must be at least 6 characters.");
        }
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match.");
        }

        setLoading(true);
        try {
            const { name, email, password } = formData;
            await register({ name, email, password });

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFD] px-4 py-10">
            <div className="max-w-md w-full bg-[#FFFFFF] p-8 md:p-10 rounded-[24px] shadow-[rgba(0,0,0,0.02)_0px_1px_3px_0px,rgba(27,31,35,0.15)_0px_0px_0px_1px]">
                <div className="text-center mb-10">
                    <div className="w-14 h-14 bg-[#EEEFFD] text-[#5B65DC] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                    </div>
                    <h2 className="text-[22px] font-[800] text-[#122056] mb-2 tracking-[-0.5px]">Create Account</h2>
                    <p className="text-[14px] text-[#8B94B1] font-[500]">Join IntellMeet and start collaborating</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-[700] text-[#122056] mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full h-[52px] bg-[#FAFAFD] rounded-2xl px-5 text-[14px] font-[600] text-[#122056] shadow-[rgba(0,0,0,0.02)_0px_1px_3px_0px,rgba(27,31,35,0.15)_0px_0px_0px_1px] focus:outline-none focus:ring-2 focus:ring-[#5B65DC]/20 focus:border-[#5B65DC] transition-all placeholder-[#8B94B1]/60"
                            placeholder="Dr. John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-[700] text-[#122056] mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full h-[52px] bg-[#FAFAFD] rounded-2xl px-5 text-[14px] font-[600] text-[#122056] shadow-[rgba(0,0,0,0.02)_0px_1px_3px_0px,rgba(27,31,35,0.15)_0px_0px_0px_1px] focus:outline-none focus:ring-2 focus:ring-[#5B65DC]/20 focus:border-[#5B65DC] transition-all placeholder-[#8B94B1]/60"
                            placeholder="name@medical.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-[700] text-[#122056] mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full h-[52px] bg-[#FAFAFD] rounded-2xl px-5 text-[14px] font-[600] text-[#122056] shadow-[rgba(0,0,0,0.02)_0px_1px_3px_0px,rgba(27,31,35,0.15)_0px_0px_0px_1px] focus:outline-none focus:ring-2 focus:ring-[#5B65DC]/20 focus:border-[#5B65DC] transition-all placeholder-[#8B94B1]/60"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-[700] text-[#122056] mb-2 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full h-[52px] bg-[#FAFAFD] border border-[#EEEFFD] rounded-2xl px-5 text-[14px] font-[600] text-[#122056] focus:outline-none focus:ring-2 focus:ring-[#5B65DC]/20 focus:border-[#5B65DC] transition-all placeholder-[#8B94B1]/60"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-[#FF4D4E] text-sm font-semibold text-center bg-[#FF4D4E]/5 py-3 rounded-xl border border-[#FF4D4E]/10">{error}</p>}


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[52px] flex items-center justify-center bg-[#5B65DC] hover:bg-[#4A54C5] text-white text-[15px] font-[800] rounded-2xl transition-all shadow-[0_10px_20px_rgba(91,101,220,0.2)] disabled:opacity-50 active:scale-[0.98] mt-2"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-8 text-center text-[#8B94B1] text-[14px] font-[500]">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#5B65DC] hover:underline font-[700]">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;