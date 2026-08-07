# Kế hoạch: Chuyển CD sang Workers Builds (native Cloudflare)

## Mục tiêu

- CI/CD đúng chuẩn cho project: CI = `quality` trên GitHub Actions; CD = Workers Builds trên Cloudflare (build+deploy ngay khi push `main`).
- Không có 2 pipeline deploy song song (tránh conflict, tránh phí runner).

## Các bước

### 1. Sửa `.github/workflows/check.yml`

- Bỏ job `deploy` (deploy job trong GH Actions sẽ bị xóa — Workers Builds đảm nhận deploy).
- `quality` job: bỏ step OpenNext build + bỏ package/upload artifact (CI không cần build Worker nữa, chỉ kiểm tra source: format, typecheck, lint, test, `next build`).
- Thêm job `worker-build-check`? — Không, để CI nhẹ và đúng nghĩa "chất lượng source". Build Worker do Workers Builds làm.

### 2. Cập nhật docs

- `docs/deploy.md`: viết lại theo Workers Builds (Build command, Deploy command, production branch, secrets/runtime vars).
- `README.md` + `AGENTS.md`: cập nhật phần Delivery.

### 3. Kết nối repo với worker trên Cloudflare (dashboard hoặc CLI)

- Worker `portfolio` → Settings → Builds → Connect GitHub repository `HuynhSang2005/portfolio`.
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`
- Production branch: `main` (mặc định).
- Không bật non-production branch builds (tùy chọn preview).
- Cấu hình runtime env vars/secrets (NEXT_PUBLIC_*, SUPABASE_SERVICE_ROLE_KEY, TURNSTILE_SECRET_KEY, RESEND_API_KEY, CONTACT_TO_EMAIL) nếu chưa có.

### 4. Cleanup

- Xóa branch `ci/redesign-build-once-artifact-deploy` (PR #3) sau khi merge/đóng.
- Cập nhật AGENTS.md workflow instructions.
