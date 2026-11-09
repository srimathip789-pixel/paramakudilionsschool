# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-staff.spec.ts >> Admin Staff Management >> should create, edit, filter, and delete a staff member
- Location: tests\admin-staff.spec.ts:16:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('table, .lucide-user') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - link "Back to School Website" [ref=e6] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - text: Back to School Website
      - generic [ref=e9]:
        - img "Lions School Logo" [ref=e11]
        - generic [ref=e12]:
          - heading "Admin Portal" [level=2] [ref=e13]
          - paragraph [ref=e14]: Paramakudi Lions Matric. School
    - generic [ref=e16]:
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]: Username or Email
          - generic [ref=e20]:
            - generic:
              - img
            - textbox "Username or Email" [ref=e21]:
              - /placeholder: lionadmin
        - generic [ref=e22]:
          - generic [ref=e23]: Password
          - generic [ref=e24]:
            - generic:
              - img
            - textbox "Password" [ref=e25]:
              - /placeholder: ••••••••
        - button "Sign In to Dashboard" [ref=e27] [cursor=pointer]
      - generic [ref=e29]: The first user can be seeded inside the Supabase Auth -> Users dashboard.
  - alert [ref=e30]
```