---
title: How To - Set Up Arch Linux
draft: false
tags:
  - linux
  - arch-linux
description:
---
> Official guide: [Arch Linux installation guide](https://wiki.archlinux.org/title/Installation_guide)

These are the steps that I had taken when installing Arch Linux on my Intel laptop!

# Start Here

## Console Keymap

Start by setting up console keyboard layout. This command lists all the available keyboard maps. 

```bash
ls /usr/share/kbd/keymaps/**/*.map.gz 
```

```plaintext
/usr/share/kbd/keymaps/amiga/amiga-de.map.gz         /usr/share/kbd/keymaps/sun/sunt4-fi-latin1.map.gz
/usr/share/kbd/keymaps/amiga/amiga-us.map.gz         /usr/share/kbd/keymaps/sun/sunt4-no-latin1.map.gz
/usr/share/kbd/keymaps/atari/atari-de.map.gz         /usr/share/kbd/keymaps/sun/sunt5-cz-us.map.gz
/usr/share/kbd/keymaps/atari/atari-se.map.gz         /usr/share/kbd/keymaps/sun/sunt5-de-latin1.map.gz
/usr/share/kbd/keymaps/atari/atari-uk-falcon.map.gz  /usr/share/kbd/keymaps/sun/sunt5-es.map.gz
/usr/share/kbd/keymaps/atari/atari-us.map.gz         /usr/share/kbd/keymaps/sun/sunt5-fi-latin1.map.gz
/usr/share/kbd/keymaps/pine/en.map.gz                /usr/share/kbd/keymaps/sun/sunt5-fr-latin1.map.gz
/usr/share/kbd/keymaps/sun/sundvorak.map.gz          /usr/share/kbd/keymaps/sun/sunt5-ru.map.gz
/usr/share/kbd/keymaps/sun/sunkeymap.map.gz          /usr/share/kbd/keymaps/sun/sunt5-uk.map.gz
/usr/share/kbd/keymaps/sun/sun-pl-altgraph.map.gz    /usr/share/kbd/keymaps/sun/sunt5-us-cz.map.gz
/usr/share/kbd/keymaps/sun/sun-pl.map.gz             /usr/share/kbd/keymaps/sun/sunt6-uk.map.gz
/usr/share/kbd/keymaps/sun/sunt4-es.map.gz
```

This may be confusing to look at, so we can filter them using `grep`.

```bash
ls /usr/share/kbd/keymaps/**/*.map.gz | grep <layout> 
```

BUT, this may still look really confusing. So, for a much user-friendly view, use  `localectl list-keymaps`. Again, you can use `grep` to look for the desired layout.

```bash
localectl list-keymaps | grep us
```

```plaintext
amiga-us
atari-us
br-latin1-us
cz-us-qwertz
is-latin1-us
mac-us
mod-dh-ansi-us
mod-dh-ansi-us-awing
mod-dh-ansi-us-fatz
mod-dh-ansi-us-fatz-wide
mod-dh-ansi-us-wide
mod-dh-iso-us
mod-dh-iso-us-wide
mod-dh-matrix-us
sunt5-cz-us
sunt5-us-cz
us
us-acentos
us1
```

I'm sticking with U.S. QWERTY so it looks like this for me,

```bash
loadkeys us
```

Keep in mind that the value should be just the name without the path and extension. 

## Internet Connection

Ping Arch Linux to see if you have Internet connection

```bash
ping -c 4 archlinux.org
```

## System Clock

Check if the Network Time Protocol (NTP) is alive and active, and the validity of time. 

```bash
timedatectl
```

```plaintext
               Local time: Sun 2025-12-14 16:50:51 +08
           Universal time: Sun 2025-12-14 08:50:51 UTC
                 RTC time: Sun 2025-12-14 08:50:51
                Time zone: Asia/Kuala_Lumpur (+08, +0800)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

>[!IMPORTANT]- Why?
>This is important to ensure that there is no issue with logs, certificates, or scheduled tasks. It's a protocol designed to synchronise the clocks of computers over a network. 

If the protocol is **NOT** active, use either command. 

```bash
timedatectl set-ntp true

systemctl enable systemd-timesyncd.service
```

# Disks

## Partitioning

It's a good practice to separate the bootloader and start-up files. Generally, `512MB` for EFI is enough. (You can go with 200MB if storage is scarce)

For most people, 2 partitions are enough, so this example will only create 2 partitions. You can make more partitions if you like, but remember that this risks losing data if you don't do it properly.

First, look for the drive name,

```bash
fdisk -l
```

In my case, it is named `/dev/nvme0n1`.

You can also list drives and partitions with `lsblk-l`

```plaintext
# I have already partition the disks

NAME      MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda         8:0    0 931.5G  0 disk 
sda1        8:1    0   750G  0 part /mnt/nextcloud
sda2        8:2    0 181.5G  0 part /mnt/music
nvme0n1   259:0    0 238.5G  0 disk 
nvme0n1p1 259:1    0   512M  0 part /efi
nvme0n1p2 259:2    0   238G  0 part /home
                                    /
```

It is much easier and less of a headache to use `cfdisk` to perform partitioning (TUI wrapper). BUT, if you still want to make your life difficult, 

```bash
# Invoke the drive for partitioning
fdisk <drive name>

#fdisk /dev/nvme0n1
```

Create the first partition 

```bash
Command (m for help): g
Command (m for help): n
Partition number (1-128, default 1): ENTER
First sector: ENTER
Last sector: +512M
Command (m for help): t
Selected parition 1
Hex code or alias: 1 # This changes the partition from 'Linux filesystem' to 'EFI System'
```

Create the second partition

```bash
Command (m for help): n
Partition number (1-128, default 1): ENTER
First sector: ENTER
Last sector: ENTER # Uses the remaining spaces
Command (m for help): p # Prints partition table 

# Check if the partition is right

# ONLY DO THIS IF THE CHANGES ARE WHAT YOU WANT
Command (m for help): w

# Quit without saving
Command (m for help): q
```

If you have additional disks (e.g. external HDDs and SSDs), you can repeat these steps, but without the commands to change the type to EFI. 

## Formatting

EFI partition requires `fat` for it to work properly. 

```bash
mkfs.fat -F 32 <partition name>

# mkfs.fat -F 32 /dev/nvme0n1p1
```

The are multiple popular filesystems on Linux today: `Ext4`, `XFS`, `Btrfs`, and `ZFs/OpenZFS`. You can look each of [them](https://wiki.archlinux.org/title/File_systems) up to find out which suits you the best. I went with `btrfs`.

```bash
mkfs.btrfs <parition name>

# mkfs.btrfs /dev/nvme0n1p2
```

Mount the root file system (**not the EFI**) to make it accessible

```bash
mount <partition name> /mnt

# mount /dev/nvme0n1p2 /mnt
```

## Disk Mounting

> These are done with the assumption that `btrfs` file system is used. 

Creating  sub-volumes in `btrfs` allows snapshots, rollbacks, and flexible volume management without the need for separate partitions. 

```bash
# Root filesystem
btrfs subvolume create /mnt/@

# User home directory
btrfs subvolume create /mnt/@home

# You can add more subvolumes if needed. 
```

For compression, we will use `zstd`.

>[!INFO]- Why?
>Compressing those sub-volumes let us: 
>1. Save disk space
>2. Improve performance
>3. Reduce write amplification

```bash
umount /mnt
mount -o compress=zstd,subvol=@ <partition name> /mnt
# mount -o compress=zstd,subvol=@ /dev/nvme0n1p2 /mnt

mkdir -p /mnt/home
mount -o compress=zstd,subvol=@home <partition name> /mnt/home
# mount -o compress=zstd,subvol=@ /dev/nvme0n1p2 /mnt/home
```

Mount `EFI` partition.

```bash
mkdir -p /mnt/efi
mount <partition name> /mnt/efi
# mount /dev/nvme0n1p1/ /mnt/efi
```

# Package Installation

Arch Linux's official documentation provides a comprehensive [list of applications](https://wiki.archlinux.org/title/List_of_applications) that you should definitely checkout. However, since we're still installing, there's really no need to install **every** essential applications yet. 

These are the packages that I installed:

| Packages                                                       | Description                                                                              |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `base`, `linux`, `linux-firmware`                              | These are **must-haves**<br>Swap `linux` with `linux-lts` for a more stable kernel<br>   |
| `base-devel`                                                   | Base development packages                                                                |
| `git`                                                          | `git` vcs                                                                                |
| `btrfs-progs`                                                  | File system management                                                                   |
| `grub`                                                         | Bootloader                                                                               |
| `efibootmgr`                                                   | Needed to install `grub`                                                                 |
| `grub-btrfs`                                                   | `btrfs` support for `grub` bootloader and allows direct boot from snapshots              |
| `inotify-tools`                                                | Used by `grub btrfsd daemon` to automatically spot new snapshots and update grub entires |
| `timeshift`                                                    | Create, plan and restore snapshots using `btrfs`                                         |
| `intel-ucode`                                                  | Microcode updates for the CPU<br>Use `amd-ucode` if you are on an AMD CPU                |
| `vim`                                                          | Editor                                                                                   |
| `networkmanager`                                               | Manage Internet connections                                                              |
| `pipewire`, `pipewire-also`, `pipewire-pulse`, `pipewire-jack` | Audio framework                                                                          |
| `wireplumber`                                                  | `pipewire` session manager                                                               |
| `reflector`                                                    | Manage mirrors for `pacman`                                                              |
| `openssh`                                                      | Use `ssh` and manage keys                                                                |
| `man`                                                          | Manual pages                                                                             |
| `sudo`                                                         | Lets you run commands as root temporarily                                                |

```bash
pacstrap -K /mnt <packages>
```

> Do note that there are alternatives to the packages listed above (e.g. pulse and jack for audio frameworks). You should look these up to check for compatibility.

# `fstab`

This fetches the disk mounting points and instructs the system to mount the disks automatically. 

```bash
genfstab -U /mnt >> /mnt/etc/fstab

# Sanity check
cat /mnt/etc/fstab
```

# Context Switch

Access the new system with `arch-chroot /mnt`

# Time Zone

The next thing to do is setting up out local time zone. To find the correct time zone information, use `ls /usr/share/zoneinfo`. This will give us a list of time zones to pick from. 

```bash
ls /usr/share/zoneinfo
```

```plaintext
frica      CET      Etc      Greenwich    Japan              Navajo      PST8PDT    Universal
America     Chile    Europe   Hongkong     Kwajalein          NZ          right      US
Antarctica  CST6CDT  Factory  HST          leapseconds        NZ-CHAT     ROC        UTC
Arctic      Cuba     GB       Iceland      leap-seconds.list  Pacific     ROK        WET
Asia        EET      GB-Eire  Indian       Libya              Poland      SECURITY   W-SU
Atlantic    Egypt    GMT      Iran         MET                Portugal    Singapore  zone1970.tab
Australia   Eire     GMT+0    iso3166.tab  Mexico             posix       Turkey     zonenow.tab
Brazil      EST      GMT-0    Israel       MST                posixrules  tzdata.zi  zone.tab
Canada      EST5EDT  GMT0     Jamaica      MST7MDT            PRC         UCT        Zulu
```

```bash
ls /usr/share/zoneinfo/Asia
```

```plaintext
Aden       Barnaul     Dili         Jayapura      Kuwait        Pontianak  Srednekolymsk  Urumqi
Almaty     Beirut      Dubai        Jerusalem     Macao         Pyongyang  Taipei         Ust-Nera
Amman      Bishkek     Dushanbe     Kabul         Macau         Qatar      Tashkent       Vientiane
Anadyr     Brunei      Famagusta    Kamchatka     Magadan       Qostanay   Tbilisi        Vladivostok
Aqtau      Calcutta    Gaza         Karachi       Makassar      Qyzylorda  Tehran         Yakutsk
Aqtobe     Chita       Harbin       Kashgar       Manila        Rangoon    Tel_Aviv       Yangon
Ashgabat   Choibalsan  Hebron       Kathmandu     Muscat        Riyadh     Thimbu         Yekaterinburg
Ashkhabad  Chongqing   Ho_Chi_Minh  Katmandu      Nicosia       Saigon     Thimphu        Yerevan
Atyrau     Chungking   Hong_Kong    Khandyga      Novokuznetsk  Sakhalin   Tokyo
Baghdad    Colombo     Hovd         Kolkata       Novosibirsk   Samarkand  Tomsk
Bahrain    Dacca       Irkutsk      Krasnoyarsk   Omsk          Seoul      Ujung_Pandang
Baku       Damascus    Istanbul     Kuala_Lumpur  Oral          Shanghai   Ulaanbaatar
Bangkok    Dhaka       Jakarta      Kuching       Phnom_Penh    Singapore  Ulan_Bator
```

```bash
ln -sf /usr/share/info/<Continent>/<Country> /etc/localtime

# ln -sf /usr/share/info/Asia/Kuala_Lumpur /etc/localtime
```

Once the time zone is selected, sync the system time to the hardware clock

```bash
hwclock --systohc
```

# Localisation

The next thing to do is to configure our system's region and language. Uncomment entries in `/etc/locale.gen`  according to your locale. You have to uncomment those lines before generating locales.

Locales are generally named as such: `\[_territory][.codeset][@modifier]`

Since I installed `vim`, I will be using that to edit the file.

```bash
vim /etc/locale.gen
```

Since I'm in Malaysia, I enabled: 
1. `en_US.utf8`
2. `ms_MY.utf8`
3. `zh_CN.utf8`

Once the desired entries have been enabled, we can generate the locales. 

```bash
locale-gen
```

Although the locale has been generated, they're not applied; so, we'll create a configuration file, `/etc/locale.conf`, and set the locale to the want we want.

```bash
touch /etc/locale.conf
vim /etc/locale.conf
```

We set the `LANG` variable to the desired one. In my case, I went with `en_US.UTF-8`.

```
LANG=en_US.UTF-8
```

> You can find more information about locale [here](https://wiki.archlinux.org/title/Locale)

To make the console keymap permanent across multiple tty sessions, we can make adjustments to `/etc/vconsole.conf`. The value should be the same as the one you set earlier in [[How To - Set Up Arch Linux#Console Keymap|here]].

```bash
KEYMAP=us
```

# Host

Now we create a hostname for you to go by. We achieve this by creating and editing `/etc/hostname`. The hostname should be in the first line.

```bash
touch /etc/hostname
nvim /etc/hostname
```

One other important thing to do is creating a `/etc/hosts` file.  This is necessary because it allows hostnames to be resolved locally instead of relying on DNS. 

>[!INFO]- Why it matters
>1. This is faster and avoids over-dependence on network connectivity.
>2. Entries in `/etc/hosts` takes priority over DNS lookups, meaning a hostname can be forced to resolve to a specific IP address, even if DNS says otherwise.
>3. If DNS servers are unavailable or misconfigured, `/etc/hosts` ensures localhost still resolves correctly.
>4. You can block or redirect unwanted domains by mapping them to a loopback IP.

Simply do,

```bash
127.0.0.1 localhost
::1 localhost
127.0.1.1 <hostname> # the one set earlier
```

# Root

Use `passwd` to set-up root and add a new user. 

```bash
passwd

useradd -mG wheel <root_name>
passwd <root_name>
```

- `m` creates the home directory 
- `G` adds the user to the `wheel` group (administration group) 

# Boot Loader

You can select your choice of bootloader [here](https://wiki.archlinux.org/title/Arch_boot_process#Boot_loader). I decided to with [`grub`](https://wiki.archlinux.org/title/GRUB#Installation).

```bash
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=GRUB
```

Generate `grub` configuration file with,

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

> I do not recommend writing your own grub configuration file unless you genuinely know what you're doing. 

# Finalising

Enable network manager before rebooting. 

```bash
systemctl enable NetworkManager
```

Simply exit the chroot environment with `exit` or `ctrl+d`. Follow this up by unmounting all the partitions using `umount -R /mnt`. Doing this lets you find *busy* partitions.

Reboot the system, unplug the installation media, and now you have an Arch Linux device! 

```bash
reboot
```

Log in with the username and password set [[How To - Set Up Arch Linux#Root|here]] and start the time synchronisation service.

```bash
timedatectl set-ntp true
```

The remaining chapters are optional, but highly recommended.

# Snapshots

Remember that we installed [[How To - Set Up Arch Linux#^f4acd3|`timeshift`]]?

Normally, every time the tool takes a system snapshot, we would have to regenerate the grub configuration manually; however, this can be avoided with a neat tool called `grub-btrfs`, which automatically updates the grub boot entries. 

This line will let you edit `grub-btrfs`; since I'm using `timeshift`, the value of `ExecStasrt` will be `/usr/bin/grub-btrfsd --syslog --timeshift-auto`. If you decided to use any other snapshot tools, refer to [this](https://github.com/Antynea/grub-btrfs)

```bash
sudo systemctl edit --full grub-btrfsd
```

# Arch User Repository

One of the great features of Arch Linux is the vast user repository. But, to access the user repository, `yay` has to first be installed.

```bash
sudo pacman -S --needed git base-devel && git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si

# Optional: This allows snapshots before pacman upgrades.
yay -S timeshift-autosnap
```

# Final Finalising

Simply `reboot` and voilà, you're now using Arch Linux! You can keep messing up your laptop or pc until you have to reinstall. 

Don't forget to occasionally run `sudo pacman -Syu` to update your packages!

# Video Drivers

If you want to use Arch Linux on a graphical environment, you would have to install video drivers. Since my laptop only has Intel iGPU, this section only covers the packages needed for my case. If you have NVIDIA GPUs, I recommend referring to this [site](https://wiki.archlinux.org/title/NVIDIA) for more information. 

For backward compatibility, I decided to add 32bit support. However, for this to work, we have to first edit `/etc/pacman.conf` and uncomment the `[multilib]` section. 

```bash
yay

sudo pacman -S mesa lib32-mesa vulkan-intel lib32-vulkan-intel xorg-server intel-media-driver
```

For AMD laptops or pcs, installation looks almost identical; just replace `intel` with `radeon`. I highly recommend reading [this](https://wiki.archlinux.org/title/AMDGPU) first though. 

# Setting up a graphical environment

I installed **Hyprland**. You can check out their [master tutorial](https://wiki.hypr.land/Getting-Started/Master-Tutorial/)

```bash
pacman -S --needed hyprland hyprlock hyprpaper rofi waybar dolphin kitty
```

| Packages    | Description                                        |
| ----------- | -------------------------------------------------- |
| `hyprland`  | The tiling WM                                      |
| `hyprlock`  | Screen-lock for Hyperland                          |
| `hyprpaper` | Wallpaper utility for Hyprland                     |
| `rofi`      | Window switcher, application and dmenu replacement |
| `waybar`    | Status bar                                         |
| `dolphin`   | File manager                                       |
| `kitty`     | Terminal emulator                                  |
 
If you're looking for inspiration on customising your device, check out [this subreddit](https://www.reddit.com/r/unixporn/) or my [dotfiles](https://github.com/HappyPotatoHead/dotfiles?tab=readme-ov-file).
