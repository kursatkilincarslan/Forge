# Third-Party Licenses

FORGE is an independent, community-made configurator tool for VEX V5 robotics projects and is **not affiliated with, endorsed by, or sponsored by VEX Robotics, Inc.** This document lists the third-party software, assets, and trademarks referenced by FORGE, along with their respective licenses.

None of the drive-code templates below are bundled or vendored inside this repository. They are fetched at project-generation time via the PROS CLI / VEXcode import process, based on the user's selection in the wizard. They are listed here for transparency and attribution.

---

## LemLib

- **Repository:** https://github.com/LemLib/LemLib
- **License:** MIT License
- **Usage in FORGE:** Selectable template option in Step 2 of the wizard. Fetched by the user's PROS CLI at project-generation time; not distributed with this repository.

```
MIT License

Copyright (c) 2024 Liam Teale and LemLib contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## PROS

- **Repository:** https://github.com/purduesigbots/pros
- **License:** Mozilla Public License 2.0 (MPL-2.0)
- **Maintainer:** Purdue ACM SIGBots
- **Usage in FORGE:** PROS is the underlying open-source kernel/build environment that generated projects target. It is installed separately by the user via the PROS CLI/toolchain and is not bundled or vendored inside this repository.

> **Note on MPL-2.0:** Same weak-copyleft terms as noted for other MPL-licensed components — modifying and redistributing PROS's own source files would require those files to remain under MPL-2.0 with source available. Since FORGE does not modify or redistribute PROS's source, this obligation does not currently apply.
>
> **Note on the VEX SDK dependency:** The PROS kernel itself depends on VEX Robotics' proprietary Software Development Kit (SDK), which is not publicly redistributable. FORGE does not bundle this SDK; it is fetched/installed through the official PROS toolchain, which handles this dependency under VEX's own terms.

Full license text: https://github.com/purduesigbots/pros/blob/develop/LICENSE (also available at https://www.mozilla.org/en-US/MPL/2.0/)

---

## Poppins (Google Fonts)

- **Source:** https://fonts.google.com/specimen/Poppins
- **License:** SIL Open Font License, Version 1.1
- **Usage in FORGE:** Loaded at runtime via the Google Fonts CDN (`fonts.googleapis.com`); not bundled as a static asset in this repository.

---

## VEX V5 Logo

- **Source:** VEX Robotics, Inc. official brand assets
- **Ownership:** The VEX V5 logo, the "VEX" and "VEX Robotics" names, and related marks are trademarks of Innovation First International, Inc. / VEX Robotics, Inc. All rights reserved.
- **Usage in FORGE:** Displayed in the footer ("Designed for VEX V5") linking to vexrobotics.com/v5, in accordance with VEX Robotics' branding guidelines for promotional and non-commercial community use.
- **Disclaimer:** This project is an independent, community-made tool and is not affiliated with, endorsed by, or sponsored by VEX Robotics, Inc. If FORGE is monetized or distributed commercially in the future, written permission must be obtained from VEX Robotics (branding@vex.com) before continued use of this logo.

---

*This document is maintained on a best-effort basis. If you are a maintainer of any of the above projects and believe this attribution is inaccurate or incomplete, please open an issue.*