const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"]
    },
    profileImageUrl: { 
      type: String, 
      default: null 
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other"
      },
      default: "male"
    },
    role: { 
      type: String, 
      enum: {
        values: ["admin", "member"],
        message: "Role must be either admin or member"
      },
      default: "member" 
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: ""
    },
    skills: [{
      type: String,
      trim: true
    }],
    experience: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      current: { type: Boolean, default: false },
      description: String
    }],
    resumeUrl: {
      type: String,
      default: null
    },
    socialLinks: {
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      github: { type: String, default: "" },
      leetcode: { type: String, default: "" },
      website: { type: String, default: "" }
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for profile display URL with gender-based defaults
UserSchema.virtual('profileDisplayUrl').get(function() {
  if (this.profileImageUrl) {
    return this.profileImageUrl;
  }
  
  // Return default icon based on gender
  const defaultIcons = {
    male: 'https://api.dicebear.com/7.x/avataaars/svg?seed=male&backgroundColor=b6e3f4',
    female: 'https://api.dicebear.com/7.x/avataaars/svg?seed=female&backgroundColor=ffd5dc&hair=long',
    other: 'https://api.dicebear.com/7.x/avataaars/svg?seed=person&backgroundColor=d1d4f9'
  };
  
  return defaultIcons[this.gender] || defaultIcons.male;
});

// Index for faster queries
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

module.exports = mongoose.model("User", UserSchema);
