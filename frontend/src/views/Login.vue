<template>
  <div class="root">
    <div class="left">
      <div class="left-inner">
        <router-link to="/" class="logo">
          <div class="logo-mark">MA</div>
          <span class="logo-text">MarketingAuto</span>
        </router-link>
        <div class="left-content">
          <h2>Welcome back</h2>
          <p>Sign in to your account to continue managing your campaigns.</p>
          <div class="testimonial">
            <p class="quote">"MarketingAuto doubled our lead conversion in just 3 months."</p>
            <div class="author">
              <div class="avatar">AK</div>
              <div>
                <strong>Arben Krasniqi</strong>
                <span>Head of Marketing, TechCo</span>
              </div>
            </div>
          </div>
        </div>
        <div class="left-stats">
          <div class="lst" v-for="s in stats" :key="s.label">
            <span class="lst-val">{{ s.val }}</span>
            <span class="lst-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="form-box">
        <h1>Sign In</h1>
        <p class="form-sub">Enter your credentials to access your dashboard</p>

        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="you@example.com" />
        </div>

        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="••••••••" />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button @click="handleLogin" :disabled="loading" class="submit-btn">
          {{ loading ? "Signing in..." : "Sign In →" }}
        </button>

        <p class="back-link">
          <router-link to="/">← Back to Home</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const stats = [
  { val: "500+", label: "Campaigns" },
  { val: "12k+", label: "Leads" },
  { val: "98%", label: "Satisfaction" },
];

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = "";
    await auth.login(email.value, password.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Invalid credentials";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.root {
  display: flex; min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

/* LEFT */
.left {
  width: 45%; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%);
  padding: 40px; display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}
.left::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(37,99,235,0.25), transparent 60%);
}
.left-inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; }
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: auto; }
.logo-mark {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px;
  display: flex; align-items: center; justify-content: center;
}
.logo-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; color: #fff; }
.left-content { margin: auto 0; padding: 40px 0; }
.left-content h2 {
  font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800;
  color: #fff; margin-bottom: 16px; line-height: 1.2;
}
.left-content > p { font-size: 16px; color: #94a3b8; line-height: 1.7; margin-bottom: 40px; }
.testimonial {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px; padding: 24px;
}
.quote { font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 20px; font-style: italic; }
.author { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.author strong { display: block; font-size: 14px; color: #fff; font-weight: 600; }
.author span { font-size: 12px; color: #64748b; }
.left-stats { display: flex; gap: 32px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); }
.lst { display: flex; flex-direction: column; gap: 4px; }
.lst-val { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #fff; }
.lst-label { font-size: 12px; color: #64748b; }

/* RIGHT */
.right {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 40px 24px; background: #f8faff;
}
.form-box { width: 100%; max-width: 420px; }
.form-box h1 {
  font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800;
  color: #0f172a; margin-bottom: 8px;
}
.form-sub { font-size: 15px; color: #64748b; margin-bottom: 36px; }

.field { margin-bottom: 20px; }
.field label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.field input {
  width: 100%; padding: 14px 16px; border-radius: 12px;
  border: 2px solid #e2e8f0; font-size: 15px; font-family: 'DM Sans', sans-serif;
  background: #fff; color: #0f172a; outline: none; transition: all 0.2s;
}
.field input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
.field input::placeholder { color: #cbd5e1; }

.error { color: #ef4444; font-size: 13px; margin-bottom: 16px; }

.submit-btn {
  width: 100%; padding: 16px; border-radius: 12px; border: none; cursor: pointer;
  font-size: 16px; font-weight: 700; font-family: 'Syne', sans-serif;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff; transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(37,99,235,0.3);
  margin-bottom: 24px;
}
.submit-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(37,99,235,0.4); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.back-link { text-align: center; }
.back-link a { font-size: 14px; color: #64748b; text-decoration: none; transition: color 0.2s; }
.back-link a:hover { color: #2563eb; }

@media (max-width: 768px) {
  .left { display: none; }
  .right { background: #fff; }
}
</style>