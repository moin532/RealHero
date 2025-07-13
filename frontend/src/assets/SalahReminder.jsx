import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loadUserAction } from "../../redux/action/UserAction";

const SalahReminder = () => {
  const [language, setLanguage] = useState("hi");
  const [remind, setRemind] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.User);

  const myuser = user?.user?.[0] || {};

  console.log(myuser);

  // Check if remindSalah is "on" and set the state accordingly
  useEffect(() => {
    if (myuser.remindSalah === "on") {
      setRemind(true);
    } else {
      setRemind(false);
    }
  }, [myuser.remindSalah]);

  const content = {
    en: {
      title: "Dhuhr Salah",
      description:
        "Perform the Dhuhr prayer on time. It consists of four Rakats and is offered in the early afternoon.",
    },
    ar: {
      title: "صلاة الظهر",
      description:
        "أداء صلاة الظهر في وقتها. تتكون من أربع ركعات وتؤدى في وقت الظهر.",
    },
    hi: {
      title: "दोपहर की नमाज़ (ज़ुहर)",
      description:
        "दोपहर की नमाज़ समय पर पढ़ें। यह चार रकअत की होती है और दोपहर में अदा की जाती है।",
    },
  };

  const token = Cookies.get("Token") ? JSON.parse(Cookies.get("Token")) : null;

  useEffect(() => {
    dispatch(loadUserAction());
  }, [dispatch]);

  const handleReminderToggle = async (value) => {
    setRemind(value); // Update local state
    const status = value ? "on" : "off";

    try {
      const res = await axios.post(
        `  http://localhost:4000/api/v1/update/salah`,
        {
          remindSalah: status,
        },
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      console.log("Reminder updated:", res.data);
    } catch (error) {
      console.error("Failed to update reminder:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <img
          src="data:image/jpeg;base64,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"
          alt="Mosque"
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {content[language].title}
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded ${
                  language === "en" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("ar")}
                className={`px-3 py-1 rounded ${
                  language === "ar" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                AR
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-3 py-1 rounded ${
                  language === "hi" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                HI
              </button>
            </div>
          </div>
          <p className="text-gray-700 text-lg mb-6">
            {content[language].description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-800 font-medium">Remind for Salah</span>
            <Switch
              checked={remind}
              onChange={handleReminderToggle} // 👈 Call function here
              className={`${
                remind ? "bg-green-500" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  remind ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          {remind && (
            <p className="text-green-600 mt-4">Salah reminder is ON</p>
          )}
          {!remind && (
            <p className="text-gray-500 mt-4">Salah reminder is OFF</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalahReminder;
