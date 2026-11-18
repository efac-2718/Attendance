# Attendance Calc

**Name:** Vishva Peiris

**Student ID:** EC/2022/070

**Demo video:** (https://drive.google.com/drive/folders/11yaLFO9thRrZrtQwTWtm352Xdlfpcy-E?usp=sharing)

Mobile Application Development – Assignment 01

---

## 1. What is the application, and what problem does it solve?

**Attendance Calc** is a mobile app that helps university students keep track of their class
attendance for each module.

Most universities require a minimum attendance percentage to sit the final exam. Students often
lose track of how many classes they have missed until it is too late. Attendance Calc solves this by:

- recording each session as **Present** or **Absent**,
- calculating the attendance percentage for every module and overall,
- colour-coding each module so problems are easy to spot,
- letting the student **filter** modules to see only the ones that need attention,
- sending a **reminder notification** so the student doesn't miss the next class.

| Status | Attendance | Colour |
|---|---|---|
| Good | 70% or above | Green |
| Warning | 50% – 69% | Amber |
| Low | below 50% | Red |

The app starts with realistic hard-coded data for four modules:

| Code | Module | Attended / Held | Status |
|---|---|---|---|
| BECS 32272 | Mobile Application Dev | 22 / 24 (92%) | Good |
| BECS 32453 | Digital Signal Processing | 14 / 24 (58%) | Warning |
| COSC 34122 | Cyber Security | 10 / 24 (42%) | Low |
| BECS 32263 | Full-Stack Software Dev | 19 / 24 (79%) | Good |

**Tech stack:** Expo SDK 58, React Native, Expo Router, expo-notifications.

---

## 2. Screens

The app has **4 screens**, split across 2 tabs.

| # | Screen | File | Purpose |
|---|---|---|---|
| 1 | **Today** (tab) | `src/app/index.tsx` | Shows today's date, when the data was last updated, and the **overall attendance** across all modules. Uses an **AppState** listener: when the app comes back from the background it refreshes the time and shows a "Welcome back" banner. |
| 2 | **Modules** (tab) | `src/app/module/index.tsx` | Lists every module in a **FlatList** with its percentage, progress bar and status. The **Filter** button opens a **Modal** to show All / Good / Warning / Low modules. The **+ Add module** button opens the Add screen. |
| 3 | **Module details** | `src/app/module/[id].tsx` | Opens when a module is tapped. Shows the attendance percentage and status, **Present** / **Absent** buttons to record today's class, and a **Remind me** button that schedules a local notification. |
| 4 | **Add module** | `src/app/module/add.tsx` | A form (module code and name) to add a new module. New modules start at 0 sessions. |

### State management

All module data lives in one shared state, `src/context/ModulesContext.tsx`, built with
`useState` and React Context. The provider wraps the whole app in `src/app/_layout.tsx`, so every
screen reads and updates the **same** data:

- `markAttendance(id, present)`: used by the Module details screen
- `addModule(code, name)`: used by the Add module screen

For example, marking a module **Absent** on its details screen immediately updates its card on the
Modules list, moves it to a different filter if its status changes, and updates the overall
percentage on the Today screen.

---

## 3. Core React Native components used

| Component | Where it is used |
|---|---|
| `View` | Layout for every screen and for `ModuleCard` (cards, rows, progress bars, chips) |
| `Text` | All text: titles, percentages, labels, buttons |
| `FlatList` | `src/app/module/index.tsx`: renders the module list (`data`, `renderItem`, `keyExtractor`, `ListEmptyComponent`) |
| `Modal` | `src/app/module/index.tsx`: the filter sheet that slides up from the bottom |
| `Pressable` | Module cards, **+ Add module**, **Filter**, filter options, **Present** / **Absent** / **Remind me**, **Save module** |
| `TextInput` | `src/app/module/add.tsx`: module code and module name fields |
| `Alert` | `add.tsx` (missing details) and `[id].tsx` (reminder set / permission needed) |
| `StyleSheet` | Styles for every screen and component |
| `AppState` | `src/app/index.tsx`: detects when the app returns from background to foreground |

**Expo / library components:**

| Component | Where it is used |
|---|---|
| `Tabs` (expo-router) | `src/app/_layout.tsx`: bottom tab bar (Today, Modules) |
| `Stack` (expo-router) | `src/app/module/_layout.tsx`: nested stack inside the Modules tab |
| `Link` (expo-router) | Module cards (to the details screen) and the **+ Add module** button |
| `MaterialCommunityIcons`, `FontAwesome6` (@expo/vector-icons) | Tab bar icons |

### Project folders

| Folder / file | Purpose |
|---|---|
| `src/app/` | Screens and layouts. Every file here is a route. |
| `src/components/ModuleCard.tsx` | Reusable card for one module. Also exports `getStatus()`, which decides Good / Warning / Low. |
| `src/context/ModulesContext.tsx` | Shared state and the hard-coded starting data. |
| `src/utils/notifications.ts` | Notification helper functions. |
| `src/constants/theme.ts` | Shared colour palette used by every screen. |

---

## 4. How Expo Router is structured

The app uses **Expo Router** (file-based routing). The router root is `src/app/`.

```
src/app/
├── _layout.tsx        → Root layout: bottom Tabs, wrapped in <ModulesProvider>
├── index.tsx          → Tab 1 "Today"                   URL: /
└── module/            → Tab 2 "Modules"
    ├── _layout.tsx    → Stack navigator (nested inside the tab)
    ├── index.tsx      → Modules list (first screen of the stack)   URL: /module
    ├── [id].tsx       → Module details (dynamic route)             URL: /module/1, /module/2, …
    └── add.tsx        → Add module form                            URL: /module/add
```

- **Tab navigation:** the root `_layout.tsx` uses `<Tabs>`. Each direct child of `app/` (the
  `index.tsx` file and the `module/` folder) becomes a tab.
- **Nested stack:** `module/` has its own `_layout.tsx` with `<Stack>`. Opening a module or the Add
  form pushes a new screen on top with a back button, while the tab bar stays visible. The tab's own
  header is hidden (`headerShown: false`) so only the stack header shows.
- **Dynamic route:** the square brackets in `[id].tsx` make the id part of the URL a variable. One file
  handles every module, and the screen reads the id with `useLocalSearchParams()`.
- **Navigation:** `<Link href={{ pathname: '/module/[id]', params: { id } }}>` opens a module,
  `<Link href="/module/add">` opens the form, and `router.back()` returns to the list after saving.
  The stack's back button and Android's back gesture close the detail and add screens.

---

## 5. Local notifications: research and implementation

### How I researched it

I started with the official Expo documentation for **expo-notifications** for SDK 58 and installed
the package with `npx expo install expo-notifications`, which picks the version that matches the SDK.
From the docs I learned that a local notification needs three steps:

1. **A notification handler:** decides what happens if a notification arrives while the app is open.
2. **Permission:** Android 13+ and iOS require the user to allow notifications.
3. **Scheduling:** a notification has `content` (title and body) and a `trigger` (when to show it).

### How it is implemented

- `src/utils/notifications.ts`
  - `setupNotificationHandler()` calls `setNotificationHandler` so the banner, list entry and sound
    are shown even when the app is in the foreground. It runs once in `src/app/_layout.tsx`.
  - `scheduleReminder(name, percent)` calls `requestPermissionsAsync()`. If the user allows it,
    it calls `scheduleNotificationAsync()` with a **`TIME_INTERVAL` trigger of 5 seconds**.
- `src/app/module/[id].tsx`: the **Remind me** button calls `scheduleReminder()` and shows an alert
  ("Reminder set" or "Permission needed").
- The notification uses live data from the shared state, for example:
  *"Cyber Security reminder: Attendance is 42%. Don't miss the next class!"*

**To test:** open a module, tap **Remind me**, allow the permission, then press the home button.
The notification appears in the notification bar after 5 seconds.

### Problems I hit and how I solved them

1. **Android channel error:** creating a custom Android notification channel failed with a native
   error in Expo Go on my phone. Android uses a default channel when none is created, so the app
   does not create one.
2. **`Cannot find native module 'ExpoApplication'`:** importing the whole `expo-notifications`
   package crashed the app on start-up. The package's main file also loads push-notification
   (push token) code, which needs the `ExpoApplication` native module, and that module was missing
   from the Expo Go app I tested with. I read the package's source files and found that the handler,
   permission and scheduling functions are each in their own file and don't need that module. So
   `notifications.ts` imports only those files (`expo-notifications/build/...`). This app only uses
   local notifications, so nothing is lost.

---

## 6. AppState: background to foreground

In `src/app/index.tsx`, a `useEffect` registers `AppState.addEventListener('change', ...)`.
A `useRef` stores the previous state. When the state changes from `background` / `inactive` to
`active`, the user has just returned to the app, so the screen:

- refreshes the date and the "Last updated" time,
- shows a green **"Welcome back! Updated just now."** banner for 3 seconds.

The listener is removed in the effect's cleanup function (`subscription.remove()`).

---

## 7. Run the project locally

**Requirements:**

- [Node.js](https://nodejs.org/) (LTS version) and Git
- The **Expo Go** app on an Android or iOS phone (supporting Expo SDK 58)
- The phone and the computer on the same Wi-Fi network

**Clone, install and run:**

```bash
git clone https://github.com/efac-2718/Attendance.git
cd Attendance
npm install
npx expo start
```

Scan the QR code shown in the terminal with **Expo Go** (Android) or the **Camera** app (iOS).

If the app shows old code or behaves strangely, restart with a cleared cache:

```bash
npx expo start -c
```

> Notifications must be tested on a real phone. They do not work in the web version.

---

## 8. Demo video

(https://drive.google.com/drive/folders/11yaLFO9thRrZrtQwTWtm352Xdlfpcy-E?usp=sharing)

The video shows:

1. The starting data on the Today and Modules screens
2. Switching between the tabs and opening a module's details (and going back)
3. Shared state: marking a module Absent and seeing the list, filter and Today screen update
4. The filter Modal (All / Good / Warning / Low) and adding a new module
5. AppState: leaving the app and returning to see the "Welcome back" banner
6. A local notification triggered by **Remind me**
