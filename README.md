# KLIND OS Client

Toto je electron aplikace která se spouští v Arch Linux pro otevření KLIND OS.

# Jak spustit development

1. Nainstalujte Node JS: [https://nodejs.org/en/download](https://nodejs.org/en/download)
2. Nainstalujte knihovny:
   ```shell
   npm install
   ```
3. Spusťte development
   ```shell
   npm run dev
   ```

POZOR! Některé funkce nemusí fungovat na jiném operačním systému než Arch Linux. Vše je testované na Arch Linux.

# Jak vykompilovat binární soubor

1. Spusťte:
   ```shell
   npm run build
   ```

Poté budete mít ve složce `dist` váš binární soubor. Pro linux je to `.AppImage` pro Windows je to `.exe` a pro mac os je to `.dmg`.
