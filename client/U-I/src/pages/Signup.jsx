import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";

function Signup() {
  const navigate = useNavigate();

  const [formdata, setdata] = useState({
    username: "",
    password: "",
    role: "user",

    personalContactValue: "",

    dealerType: "individual",

    localities: [],

    companyName: "",
    companyAddress: "",
    companyContactValue: "",
    companyDescription: "",
  });
  const mumbaiLocalities = [
    "colaba",
    "nariman point",
    "marine lines",
    "churchgate",
    "fort",
    "cuffe parade",
    "malabar hill",
    "walkeshwar",
    "breach candy",
    "tardeo",
    "haji ali",
    "worli",
    "lower parel",
    "prabhadevi",
    "dadar",
    "mahim",
    "matunga",
    "sion",

    "bandra",
    "khar",
    "santacruz",
    "vile parle",
    "andheri",
    "jogeshwari",
    "goregaon",
    "malad",
    "kandivali",
    "borivali",
    "dahisar",

    "kurla",
    "vidyavihar",
    "ghatkopar",
    "vikroli",
    "bhandup",
    "mulund",
    "thane",
    "kalyan",
    "dombivli",
    "ambernath",
    "badlapur",

    "mankhurd",
    "govandi",
    "chembur",
    "tilak nagar",
    "koperkhairane",
    "navi mumbai",
    "nerul",
    "vashi",
    "sanpada",
    "seawoods",
    "belapur",
    "kharghar",
    "panvel",

    "byculla",
    "mazgaon",
    "parel",
    "lalbaug",
    "chinchpokli",
    "sewri",
    "wadala",
    "sion",
    "king circle",
    "mumbai central",
    "grant road",
    "charni road",
    "matunga west",
    "dadar west",
    "prabhadevi west",
    "dadar east",
    "parel east",
    "mahalakshmi",
    "mahim west",
    "bandra west",
    "bandra east",
    "khar west",
    "khar east",
    "santacruz east",
    "santacruz west",
    "vile parle east",
    "vile parle west",
    "andheri east",
    "andheri west",
    "jogeshwari east",
    "jogeshwari west",
    "goregaon east",
    "goregaon west",
    "malad east",
    "malad west",
    "kandivali east",
    "kandivali west",
    "borivali east",
    "borivali west",
    "dahisar east",
    "dahisar west",
    "mira road",
    "bhayandar",
    "naigaon",
    "vasai",
    "virar",
  ];
  const localityOptions = mumbaiLocalities.map((l) => ({
    value: l,
    label: l,
  }));

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);

  const isCompanyAccount =
    (formdata.role === "dealer" && formdata.dealerType === "agency") ||
    formdata.role === "builder";

  function handleChange(e) {
    const { id, value } = e.target;

    setdata((prev) => {
      const newState = { ...prev, [id]: value };

      if (id === "role") {
        if (value === "user") {
          newState.dealerType = "individual";
          newState.localities = [];
          newState.companyName = "";
          newState.companyAddress = "";
          newState.companyContactValue = "";
          newState.companyDescription = "";
        } else if (value !== "dealer") {
          newState.localities = [];
        } else if (value === "builder") {
          newState.personalContactValue = "";
        }
      } else if (id === "dealerType") {
        if (value === "agency") {
          newState.personalContactValue = "";
        } else {
          newState.companyName = "";
          newState.companyAddress = "";
          newState.companyContactValue = "";
          newState.companyDescription = "";
        }
      }

      return newState;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formdata?.username?.trim() || !formdata?.password?.trim()) {
      seterror("Username and password are required");
      return;
    }

    if (!isCompanyAccount && !formdata?.personalContactValue?.trim()) {
      seterror("Personal email is required");
      return;
    }

    if (isCompanyAccount && !formdata.companyContactValue?.trim()) {
      seterror("Company email is required");
      return;
    }
    if (isCompanyAccount && !formdata.companyDescription?.trim()) {
      seterror("Company description is required");
      return;
    }

    if (formdata.role === "dealer" && formdata.localities.length === 0) {
      seterror("Please select at least one locality");
      return;
    }

    if (
      isCompanyAccount &&
      (!formdata.companyName || !formdata.companyAddress)
    ) {
      seterror("Company name and address are required");
      return;
    }

    const Email =
      formdata.personalContactValue?.toLowerCase().trim() ||
      formdata.companyContactValue.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "yahoo.in",
      "rediffmail.com",
      "icloud.com",
      "protonmail.com",
      "aol.com",
      "zoho.com",
      "mail.com",
      "gmail.co.in",
    ];

    if (!emailRegex.test(Email)) {
      seterror("Please enter a valid email address");
      return;
    }

    const domain = Email.split("@")[1];

    if (!allowedDomains.includes(domain)) {
      seterror("Please Enter valid Domain of email");
      return;
    }
    try {
      setloading(true);
      seterror(null);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Signup failed");
      }

      setloading(false);
      seterror(false);
      navigate("/sign-in");
    } catch (err) {
      setloading(false);
      seterror(err.message || "Something went wrong");
    }
  }

  return (
    <div className="mx-auto mt-8 bg-gray-100 w-96 p-6 shadow-lg rounded-md">
      <h1 className="text-2xl text-gray-600 font-semibold mb-4">Sign Up</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input id="username" placeholder="Username" onChange={handleChange} />

        <input
          id="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <select id="role" value={formdata.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="dealer">Dealer</option>
          <option value="builder">Builder</option>
        </select>

        {formdata.role === "dealer" && (
          <select
            id="dealerType"
            value={formdata.dealerType}
            onChange={handleChange}
          >
            <option value="individual">Individual Dealer</option>
            <option value="agency">Agency</option>
          </select>
        )}

        {!isCompanyAccount && (
          <input
            id="personalContactValue"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
          />
        )}

        {formdata.role === "dealer" && (
          <div>
            <p className="font-medium mb-1">Select Localities</p>
            <Select
              isMulti
              options={localityOptions}
              placeholder="Search & select localities..."
              className="w-full"
              onChange={(selected) => {
                setdata((p) => ({
                  ...p,
                  localities: selected.map((s) => s.value),
                }));
              }}
            />
          </div>
        )}

        {isCompanyAccount && (
          <>
            <input
              id="companyName"
              placeholder="Company Name"
              onChange={handleChange}
            />

            <input
              id="companyAddress"
              placeholder="Company Address"
              onChange={handleChange}
            />

            <input
              id="companyContactValue"
              type="email"
              placeholder="Company email"
              onChange={handleChange}
            />

            <textarea
              id="companyDescription"
              placeholder="Company Description "
              onChange={handleChange}
            />
          </>
        )}

        <button className="bg-gray-400 rounded-lg w-full p-2 mt-3 text-gray-900 hover:opacity-90">
          {loading ? "SIGNING UP" : "SIGN UP"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <Link to="/sign-in" className="text-blue-600">
        Sign In
      </Link>
    </div>
  );
}

export default Signup;
