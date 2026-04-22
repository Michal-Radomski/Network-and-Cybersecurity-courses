While true "viruses" (malware that replicates by attaching to other files) are rare on Ubuntu, various forms of malware like
botnets, rootkits, and ransomware target Linux systems. [1, 2]

## Famous Malware Targeting Linux/Ubuntu

Most threats on Ubuntu are designed for servers or specific vulnerabilities rather than general desktop users. [1, 3]

- Mirai: A notorious botnet that infects poorly secured IoT devices and Linux servers to launch massive DDoS attacks.
- Erebus: A ransomware strain known for targeting Linux-based web servers, encrypting files and demanding payment.
- Symbiote: A sophisticated rootkit that hides itself within running processes and steals credentials.
- OrBit: Credential-stealing malware that targets Linux systems to capture SSH and other sensitive login information.
- Legacy Examples: Older proof-of-concept viruses like Staog, Bliss, Bad Bunny, and Alaeda exist but are largely irrelevant
  to modern, patched systems. [3, 4, 5, 6, 7, 8]

## How to Detect Malware on Ubuntu

Detection typically involves specialized scanning tools and monitoring for unusual system behavior. [9, 10]

## 1. Recommended Scanning Tools

- ClamAV: The most popular open-source antivirus for Linux. It is effective at identifying known malware signatures.
- Install: sudo apt install clamav
  - Update signatures: sudo freshclam
  - Scan: sudo clamscan -r /path/to/scan
- rkhunter (Rootkit Hunter): Specifically designed to find rootkits and backdoors by checking system binaries against a known
  database.
- Install: sudo apt install rkhunter
- chkrootkit: Another common tool for detecting rootkits and hidden security holes.
- Install: sudo apt install chkrootkit [11, 12, 13, 14, 15, 16]

## 2. Manual Signs of Compromise

- CPU/RAM Spikes: Unusual, sustained high usage by unknown processes (check with top or htop).
- Unusual Network Traffic: Unexpected outgoing connections, especially to foreign IP addresses (use netstat or lsof).
- Suspicious Logs: Check /var/log/auth.log for failed login attempts or /var/log/syslog for general anomalies.
- Unexpected System Behavior: Crashing browsers, disappearing files, or modified system binaries. [9, 10, 17, 18, 19]

[1] [https://www.youtube.com](https://www.youtube.com/watch?v=zBYeA_oyLqI&t=10) [2]
[https://www.quora.com](https://www.quora.com/What-is-the-most-famous-Linux-virus) [3]
[https://www.youtube.com](https://www.youtube.com/watch?v=zBYeA_oyLqI&t=10) [4]
[https://www.uptycs.com](https://www.uptycs.com/blog/threat-research-report-team/linux-commands-and-utilities-commonly-used-by-attackers)
[5]
[https://www.geeksforgeeks.org](https://www.geeksforgeeks.org/ethical-hacking/what-is-linux-malware/#:~:text=Table_title:%20Examples%20of%20Linux%20Malware%20and%20Their,update%20&&%20apt%20upgrade%20%2Dy%20%29%20%7C)
[6] [https://help.ubuntu.com](https://help.ubuntu.com/community/Linuxvirus) [7]
[https://help.ubuntu.com](https://help.ubuntu.com/community/Linuxvirus) [8]
[https://help.ubuntu.com](https://help.ubuntu.com/community/Linuxvirus) [9]
[https://tuxcare.com](https://tuxcare.com/blog/linux-malware/) [10]
[https://tuxcare.com](https://tuxcare.com/blog/linux-malware/) [11]
[https://askubuntu.com](https://askubuntu.com/questions/417429/how-can-i-scan-for-possible-viruses-on-my-ubuntu-system) [12]
[https://www.interserver.net](https://www.interserver.net/tips/kb/best-antivirus-softwares-for-ubuntu-in-2025/) [13]
[https://www.youtube.com](https://www.youtube.com/watch?v=WkdJd5fQ60U&t=67) [14]
[https://upcloud.com](https://upcloud.com/resources/tutorials/scan-ubuntu-server-malware/) [15]
[https://www.interserver.net](https://www.interserver.net/tips/kb/scan-ubuntu-server-for-malware-and-rootkits/) [16]
[https://help.clouding.io](https://help.clouding.io/hc/en-us/articles/4409694394770-How-to-scan-a-Linux-server-for-viruses-and-malware#:~:text=Chkrootkit.%20If%20you%20want%20to%20scan%20your,string%20replacement%20and%20checking%20for%20utmp%20deletes.)
[17] [https://www.youtube.com](https://www.youtube.com/watch?v=94QsgdXnsmU) [18]
[https://www.youtube.com](https://www.youtube.com/watch?v=N4S2XEMH7zA&t=163) [19]
[https://bitlaunch.io](https://bitlaunch.io/blog/how-to-check-your-server-for-suspicious-activity-in-linux/)

---

To use rkhunter and chkrootkit on Ubuntu, you must first install them via the terminal and then run them with administrative
(sudo) privileges to scan sensitive system files. [1]

## 1. Using rkhunter (Rootkit Hunter)

[rkhunter](https://askubuntu.com/questions/732726/how-to-install-rkhunter-in-ubuntu) is a powerful tool that compares your
system files against a database of known rootkits and checks for suspicious file properties. [2, 3]

- Install: sudo apt update && sudo apt install rkhunter -y
- Update the Database: Before scanning, always update the malware definitions and file property database to reduce false
  positives. sudo rkhunter --update sudo rkhunter --propupd
- Run a Scan: Perform a full system check. You will need to press Enter after each section unless you add the --skip-keypress
  flag. sudo rkhunter --check
- Review Findings: If you want to see only the warnings, use: sudo rkhunter --check --report-warnings-only [4, 5, 6, 7, 8, 9,
  10]

## 2. Using chkrootkit

[chkrootkit](https://www.chkrootkit.org/) is a lighter shell script that checks system binaries like ls and ps to see if they
have been modified by a rootkit. [11, 12]

- Install: sudo apt update && sudo apt install chkrootkit -y
- Run a Basic Scan: This will run through all tests and output the status of each. sudo chkrootkit
- Quiet Mode: To see only suspicious results and ignore the "not infected" messages, use the quiet flag. sudo chkrootkit -q
- Advanced Checks: You can also run specific tests, such as checking for network sniffers or hidden processes: sudo
  chkrootkit sniffer sudo chkrootkit lkm (checks for Loadable Kernel Modules) [5, 11, 13, 14, 15, 16, 17]

## Important Notes

- False Positives: Both tools frequently flag legitimate system changes as suspicious. Always investigate a "Warning" before
  assuming your system is infected.
- Clean Installs: For the best results,
  [rkhunter](https://www.cyberciti.biz/faq/howto-check-linux-rootkist-with-detectors-software/) should ideally be installed
  on a fresh system so it can establish a "known good" baseline of your files. [18, 19, 20]

[1] [https://www.golinuxcloud.com](https://www.golinuxcloud.com/install-chkrootkit-on-ubuntu/) [2]
[https://askubuntu.com](https://askubuntu.com/questions/732726/how-to-install-rkhunter-in-ubuntu#:~:text=To%20install%20rkhunter%20in%20Ubuntu%2C%20you%20can,can%20run%20on%20almost%20all%20UNIX%2Dderived%20systems.)
[3]
[https://askubuntu.com](https://askubuntu.com/questions/732726/how-to-install-rkhunter-in-ubuntu#:~:text=To%20install%20rkhunter%20in%20Ubuntu%2C%20you%20can,can%20run%20on%20almost%20all%20UNIX%2Dderived%20systems.)
[4] [https://www.youtube.com](https://www.youtube.com/watch?v=y4m6nR4XvJ4&t=44) [5]
[https://www.youtube.com](https://www.youtube.com/shorts/nIJ8aObCsC4#:~:text=1%EF%B8%8F%E2%83%A3%20Install%20chkrootkit%20&%20rkhunter%20sudo%20apt,Updates%20package%20lists%20and%20installs%20both%20tools)
[6] [https://www.scaleway.com](https://www.scaleway.com/en/docs/tutorials/install-rkhunter/) [7]
[https://upcloud.com](https://upcloud.com/resources/tutorials/scan-ubuntu-server-malware/) [8]
[https://oneuptime.com](https://oneuptime.com/blog/post/2026-01-15-configure-rkhunter-rootkit-detection-ubuntu/view) [9]
[https://dohost.us](https://dohost.us/index.php/2025/11/09/detecting-rootkits-and-hidden-modules-chkrootkit-rkhunter-introduction/)
[10] [https://oneuptime.com](https://oneuptime.com/blog/post/2026-01-15-configure-rkhunter-rootkit-detection-ubuntu/view)
[11] https://www.chkrootkit.org [12]
[https://www.geeksforgeeks.org](https://www.geeksforgeeks.org/linux-unix/detecting-and-checking-rootkits-with-chkrootkit-and-rkhunter-tool-in-kali-linux/)
[13]
[https://www.alibabacloud.com](https://www.alibabacloud.com/blog/how-to-install-chkrootkit-security-scanner-on-ubuntu-18-04_595711)
[14] [https://forum.zorin.com](https://forum.zorin.com/t/rootkit-hunter-and-chkrootkit/25564) [15]
[https://www.youtube.com](https://www.youtube.com/watch?v=CoK4Z341lWo&t=6) [16]
[https://oneuptime.com](https://oneuptime.com/blog/post/2026-03-02-how-to-scan-for-rootkits-with-rkhunter-and-chkrootkit-on-ubuntu/view)
[17]
[https://www.researchgate.net](https://www.researchgate.net/publication/392122974_Full_Lab_to_Master_Chkrootkit_rkhunter)
[18] [https://www.cyberciti.biz](https://www.cyberciti.biz/faq/howto-check-linux-rootkist-with-detectors-software/) [19]
[https://help.ubuntu.com](https://help.ubuntu.com/community/RKhunter) [20]
[https://www.youtube.com](https://www.youtube.com/watch?v=_M-S5NiFnSI&t=5)

---

This error occurs because the Ubuntu/Debian package for rkhunter intentionally disables web updates by default for security.
The configuration file points WEB_CMD to /bin/false to prevent the tool from automatically connecting to external mirrors.
[1, 2] To fix this and enable updates, you need to edit the configuration file and change three specific settings. [3, 4]

## Steps to Fix the Update Error

1.  Open the configuration file with root privileges: sudo nano /etc/rkhunter.conf
2.  Find and modify the following lines (you can use Ctrl+W in nano to search):

- Change WEB_CMD="/bin/false" to WEB_CMD="" (Note: Some users prefer setting this specifically to /usr/bin/curl or
  /usr/bin/wget)
  - Change UPDATE_MIRRORS=0 to UPDATE_MIRRORS=1
  - Change MIRRORS_MODE=1 to MIRRORS_MODE=0

3.  Save and exit: Press Ctrl+O, then Enter, then Ctrl+X.
4.  Run the update again: sudo rkhunter --update [1, 3, 5, 6, 7, 8]

## Why was this disabled?

Maintainers often disable this because they prefer you to receive security updates through the official Ubuntu package
repositories (apt upgrade) rather than having the tool download third-party data from external mirrors. However, enabling it
is common if you want the very latest rootkit signatures. [3, 9, 10]

## Next Step: Resolving "False Positives"

Once updates work, your first scan will likely show many [WARNING] flags for files like /usr/bin/egrep or ls. This is normal.
To tell rkhunter that your current system files are safe (creating a baseline), run: sudo rkhunter --propupd [6, 11]

[1]
[https://unix.stackexchange.com](https://unix.stackexchange.com/questions/562560/invalid-web-cmd-configuration-option-relative-pathname-bin-false)
[2] [https://churchill.ddns.me.uk](https://churchill.ddns.me.uk/post/rkhunter-invalid-web-cmd-configuration-option/) [3]
[https://linux.how2shout.com](https://linux.how2shout.com/install-and-use-rootkit-hunter-on-ubuntu-such-as-24-04-or-22-04/)
[4] [https://forum.zorin.com](https://forum.zorin.com/t/rootkit-hunter-and-chkrootkit/25564) [5]
[https://docs.faveohelpdesk.com](https://docs.faveohelpdesk.com/docs/helpers/rkhunter/) [6]
[https://forum.zorin.com](https://forum.zorin.com/t/rootkit-hunter-and-chkrootkit/25564) [7]
[https://forums.linuxmint.com](https://forums.linuxmint.com/viewtopic.php?t=386883) [8]
[https://askubuntu.com](https://askubuntu.com/questions/989492/rkhunter-doesnt-update-in-ubuntu-17-10) [9]
[https://unix.stackexchange.com](https://unix.stackexchange.com/questions/562560/invalid-web-cmd-configuration-option-relative-pathname-bin-false)
[10] [https://forum.howtoforge.com](https://forum.howtoforge.com/threads/rkhunter-not-running.78501/) [11]
[https://www.digitalocean.com](https://www.digitalocean.com/community/tutorials/how-to-use-rkhunter-to-guard-against-rootkits-on-an-ubuntu-vps)
