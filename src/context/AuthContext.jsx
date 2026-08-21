import React, { createContext, useContext, useState, useEffect } from "react";
import { Database } from "../data/database";
import { hashPassword } from "../utils/crypto";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("smartstat_role_v2") || "landing"; // 'landing', 'student-login', 'student-register', 'student', 'admin'
  });

  const [currentStudent, setCurrentStudent] = useState(() => {
    const savedRegNo = localStorage.getItem("smartstat_current_student_reg");
    if (savedRegNo) {
      const found = Database.getStudentByRegNo(savedRegNo);
      if (found) return found;
    }
    // Default demo student Harish V (24IT101)
    const students = Database.getStudents();
    return students.find((s) => s.registration_number === "24IT101") || students[0] || null;
  });

  const [isAuthenticatedStudent, setIsAuthenticatedStudent] = useState(() => {
    return localStorage.getItem("smartstat_student_authenticated") === "true";
  });

  const [adminUser] = useState({
    id: "ADM-001",
    name: "Dr. S. Mohanraj",
    role: "Chief Store & Procurement Officer",
    department: "Campus Stationery Division",
    college: "Nandha Engineering College",
    email: "stationery.admin@nandha.edu.in",
    avatar: "SM"
  });

  useEffect(() => {
    localStorage.setItem("smartstat_role_v2", role);
  }, [role]);

  useEffect(() => {
    if (currentStudent && isAuthenticatedStudent) {
      localStorage.setItem("smartstat_current_student_reg", currentStudent.registration_number || currentStudent.rollNo);
      localStorage.setItem("smartstat_student_authenticated", "true");
    } else {
      localStorage.removeItem("smartstat_student_authenticated");
    }
  }, [currentStudent, isAuthenticatedStudent]);

  // Student Login with Registration Number + Password Verification
  const studentLogin = async (registrationNumber, password) => {
    if (!registrationNumber || !password) {
      throw new Error("Invalid Registration Number or Password.");
    }

    const cleanRegNo = registrationNumber.trim().toUpperCase();
    const pHash = await hashPassword(password);
    const verified = Database.verifyStudentCredentials(cleanRegNo, pHash);

    if (!verified) {
      // Generic error as per security requirement (do not reveal which field is incorrect)
      throw new Error("Invalid Registration Number or Password.");
    }

    setCurrentStudent(verified);
    setIsAuthenticatedStudent(true);
    setRole("student");
    return verified;
  };

  // Student Registration
  const studentRegister = async (registrationData) => {
    const { password, ...rest } = registrationData;
    const pHash = await hashPassword(password);

    const created = Database.addStudent({
      ...rest,
      password_hash: pHash
    });

    setCurrentStudent(created);
    setIsAuthenticatedStudent(true);
    setRole("student");
    return created;
  };

  // Student Profile Update (Registration Number is preserved)
  const studentUpdateProfile = async (updatedFields) => {
    if (!currentStudent) return null;

    let pHash = undefined;
    if (updatedFields.newPassword) {
      pHash = await hashPassword(updatedFields.newPassword);
    }

    const updated = Database.updateStudentProfile(currentStudent.registration_number || currentStudent.rollNo, {
      ...updatedFields,
      ...(pHash ? { password_hash: pHash } : {})
    });

    if (updated) {
      setCurrentStudent(updated);
    }
    return updated;
  };

  // Student Logout
  const studentLogout = () => {
    setIsAuthenticatedStudent(false);
    localStorage.removeItem("smartstat_student_authenticated");
    localStorage.removeItem("smartstat_current_student_reg");
    setRole("student-login");
  };

  // Admin Portal Authentication
  const loginAsAdmin = () => {
    setRole("admin");
  };

  const adminLogout = () => {
    setRole("landing");
  };

  // Quick switch for demo/testing purposes
  const switchStudent = (regNo) => {
    const student = Database.getStudentByRegNo(regNo);
    if (student) {
      setCurrentStudent(student);
      setIsAuthenticatedStudent(true);
      setRole("student");
    }
  };

  const reloadStudentData = () => {
    if (currentStudent) {
      const fresh = Database.getStudentByRegNo(currentStudent.registration_number || currentStudent.rollNo);
      if (fresh) setCurrentStudent(fresh);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        currentStudent,
        isAuthenticatedStudent,
        adminUser,
        studentLogin,
        studentRegister,
        studentUpdateProfile,
        studentLogout,
        loginAsAdmin,
        adminLogout,
        switchStudent,
        reloadStudentData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
