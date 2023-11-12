<p align="center">
  <a href="https://ramadan.zakiego.com/">
    <picture>
      <img src="https://raw.githubusercontent.com/zakiego/ramadan-countdown/main/public/icon.png?token=GHSAT0AAAAAAB57T3SBVSCKH432DOYANBIMZKQVROQ" height="128">
    </picture>
    <h1 align="center">Ramadan Countdown</h1>
  </a>
</p>

This is a simple countdown app for Ramadan. It is built using [Next.js](https://nextjs.org/) and [Keystatic](https://keystatic.com/).

## API

```bash
https://ramadan.zakiego.com/api/countdown
```

Response:

```json
{
  "ramadanStartDate": "2024-03-12T00:00:00.000Z",
  "currentDate": "2023-11-12T16:10:26.215Z",
  "timezoneOffset": 7,
  "countdown": {
    "days": 120,
    "hours": 7,
    "minutes": 49,
    "seconds": 33
  },
  "repository": "https://github.com/zakiego/ramadan-countdown"
}
```
