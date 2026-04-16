const fs = require('fs');
const content = fs.readFileSync('backend/controllers/auth.js', 'utf8');
const fixed = content.replace(/export const signup = async \(req, res\) => \{\s*export const sendOTP = async \(req, res\) => \{/, 
`export const signup = async (req, res) => {
  try {
    const {
      name, email, password, role, college, company, alumniPlan,
      domain, city, country, joiningYear, passingYear, degree, branch
    } = req.body;

    const existingUser = ((await Student.findOne({ email })) || (await Alumni.findOne({ email })) || (await Admin.findOne({ email })));
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userData = {
      name, email, password,
      role: role || "student",
      college: college || "",
      company: company || "",
      alumniPlan: role === "alumni" ? (alumniPlan || "simple") : undefined,
      domain, city, country,
      joiningYear, passingYear,
      degree, branch
    };
    
    let user;
    if (userData.role === "alumni") {
      user = await Alumni.create(userData);
    } else if (userData.role === "admin") {
      user = await Admin.create(userData);
    } else {
      user = await Student.create(userData);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const fullUser = ((await Student.findById(user._id).select("-password")) || (await Alumni.findById(user._id).select("-password")) || (await Admin.findById(user._id).select("-password")));

    res.status(201).json({ message: "Signup successful", user: fullUser, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const sendOTP = async (req, res) => {`);
fs.writeFileSync('backend/controllers/auth.js', fixed);
