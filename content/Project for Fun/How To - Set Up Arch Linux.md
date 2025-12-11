---
title: How To - Set Up Arch Linux
draft: true
tags:
description:
---
Official guide: [Arch Linux installation guide](https://wiki.archlinux.org/title/Installation_guide)

# Start Here

## Keyboard

Start with setting up keyboard layout

```bash
ls /usr/share/kbd/keymaps/**/*.map.gz 
```

This command lists all the available keyboard maps; to filter them, use `grep`.

```bash
ls /usr/share/kbd/keymaps/**/*.map.gz | grep <layout> 
```

You can list the available layout with `localectl list-keymaps`

## Internet Connection

Ping arch linux to see if you have Internet connection

```bash
ping -c 4 archlinux.org
```

## Clock

Check if `ntp` is alive and active and the validity of time

```bash
timedatectl
```

If `ntp` is **NOT** active (either command is fine)

```bash
timedatectl set-ntp true

systemctl enable systemd-timesyncd.service
```

# Disks
## Partitioning

It's generally a good practice to separate the OS installation from everything else. `512MB` for EFI is enough for Arch Linux.

> You can make more partitions if you like, but remember that this risks losing data if you don't do it properly.

This example involves creating only 2 partitions

First, look for the drive name

```bash
fdisk -l
```

It's a lot better to use `cfdisk` to perform partitioning (TUI wrapper), but if you still want to use `fdisk`, 

```bash
# Invoke the drive for partitioning
fdisk <drive name>
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

## Formatting

EFI partition requires `fat` for it to work properly

```bash
mkfs.fat -F 32 <partition name>
```

Use `fdisk -l` again to find the name of disks and partitions

The are multiple popular filesystems on Linux today: `Ext4`, `XFS`, `Btrfs`, and `ZFs/OpenZFS`. You can look each of them up to find out which suits you the best. I decided to go with `btrfs`.

```bash
mkfs.btrfs <parition name>
```

Finally, mount the root file system (**not the EFI**) to make it accessible

```bash
mount <partition name> /mnt
```

## Disk Mounting

> This assumes btrfs file system

Creating subvolumes in `Btrfs` allows snapshots, rollbacks, and flexible management without needing separate partitions. 

```bash
# Root filesystem
btrfs subvolume create /mnt/@

# User home directory
btrfs subvolume create /mnt/@home

# You can add more subvolumes if needed. 
```

Temporarily unmount the root partition for compression. This set up uses `Zstd`. 

```bash
umount /mnt
mount -o compress=zstd,subvol=@ <partition name> /mnt
mkdir -p /mnt/home
mount -o compress=zstd,subvol=@home <partition name> /mnt/home
```

Mount `EFI` partition

```bash
mkdir -p /mnt/efi
mount <partition name> /mnt/efi
```

# Package Installation

This site provides a comprehensive lists of applications that may fulfil your needs: [List of Applications](https://wiki.archlinux.org/title/List_of_applications) 

This is what I installed

```bash
# "base, linux, linux-firmware" are must-haves. Swap linux with linux-lts for a more stable kernel
# "base-devel" for base development packages
# "git" isn't necessary, unless you're a developer
# "btrfs-progs" are needed for file system management
# "grub" is the bootloader
# "efibootmgr" is needed to intall grub
# "inotify-tools" is used by grub btrfsd daemon to automatically spot new snapshots and update grub entires
# "timeshift" is a GUI tool to create, plan, and restore snapshots using Btrfs
# "intel-ucode" or "amd-ucode"
# "nvim" or "vim" or "nano"
# "networkmanager" is needed to manage Internet connections (both wired and wireless)
# "pipewire pipewire-alsa pipewire-pulse pipewire-jack" are teh audio framework
# "wireplumber" is the pipewire session manager.
# "reflector" is needed to manage mirrors for pacman
# "openssh" to use ssh and manage keys
# "man" for manual
# "sudo" to run commands as root temporarily

pacstrap -K /mnt <packages>
```

> Do note that there are alternatives to the packages listed above (e.g. pulse and jack for audio frameworks). You should look these up to check for compatibility.

# Fstab

These commands are for automatic re-mount the partitions after rebooting.

```bash
genfstab -U /mnt >> /mnt/etc/fstab

cat /mnt/etc/fstab
```

# Context Switch

Access the new system with `arch-chroot /mnt`

# Time Zone

Now we have to set up the local time zone. To find the correct time zone information, use `ls /usr/share/zoneinfo`. This will give us a list of time zones to pick from. 

```bash
# Can't exactly remember if they are /<Continent>/
ln -sf /usr/share/info/<Continent>/<Country> /etc/localtime
```

Once the time zone is selected, sync the system time to the hardware clock

```bash
hwclock --systohc
```

