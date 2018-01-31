#|| goto :windows_detected
# to install SPIN, use this command on Debian/Ubuntu:
# sh -c "$(wget -O - https://safwat.xyz/install-spin)"
# More info about spin: http://spinroot.com
# This is a helper script for installation

# The installer normally needs an internet connect, but it can also work offline.

#Offline installer instructions:
# If you'd like to install spin on a machine that has no Internet connection:
#1. Download www.safwat.xyz/spin/install.sh
#2. Run it, it should fetch src647.tar.gz and ispin.tcl
#3. Copy install.sh, src647.tar.gz, and ispin.tcl into the offline machine 
#4. Make sure the three files are in the same directory, then run install.sh
# NOTE: If dependencies are missing, apt-get cannot work offline and needs an
# internet connection

{ # put the whole thing in a block so as not to behave weirdly if interrupted
CHECKSUM_ISPIN=1
echo ""
echo ""
echo ""
echo "------------"
echo "This is an interactive spin and iSpin installer by Safwat Halaby"
echo "The installer will connect to http://spinroot.com, then fetch and compile files"
echo "If that fails, http://safwat.xyz is used as a fallback "
echo "The installer can also work offline. See comments inside the file"
echo "press ENTER to continue, or CTRL+C to abort"
read dummy

missingPrograms()
{
	echo "$1 is missing. I need to install all dependencies first. Auto-executing this command:"
	echo ">sudo apt-get install bison gcc make wget perl"
	echo "(please type your password if asked. Also, Internet connection is needed):"
	sudo apt-get install bison gcc make wget perl || error "Failed to install dependencies. Sorry! Try again, or try running as root, or try installing above dependencies manually"
	echo "Dependency installation finished!"
}

downloadFailed()
{
	echo "Download failed. Bad internet maybe?"
	echo "Try running again, or try obtaining a local copy of the installer"
	exit 1
}

error()
{
	echo "$1"
	exit 1
}

#DEPENDENCY CHECK
command -v yacc > /dev/null || missingPrograms "Bison"
command -v make > /dev/null || missingPrograms "make"
command -v gcc > /dev/null || missingPrograms "GCC compiler"
command -v perl > /dev/null || missingPrograms "perl"
command -v wget > /dev/null || missingPrograms "wget"

#CHECK IF ALREADY INSTALLED
if [ -f spin_cli ] && [ -f ispin.tcl ]; then
	echo "Spin is already installed. you should use ./ispin.tcl to run it. (or click on ispin in your GUI, if that works)."
	echo "Running it automatically for you..."
	./ispin.tcl || error "oops. failed to run. Try removing everything and re-running the installer. bye!"
	echo "spin has exited."
	echo "Bye!"
	exit 0
fi


#DOWNLOAD OR CHECK IF SOURCE CODE IS ALREADY THERE
if [ ! -f src647.tar.gz ]; then
	echo "Downloading (1/3) spin source code from http://spinroot.com/spin/Src/src647.tar.gz..."
	err=0
	wget http://spinroot.com/spin/Src/src647.tar.gz 2> /dev/null > /dev/null || err=1
	if [ $err = 1 ]; then
		err=0
		echo "Couldn't download. Trying to download from mirror: http://www.safwat.xyz/spin/src647.tar.gz"
		wget http://www.safwat.xyz/spin/src647.tar.gz 2> /dev/null > /dev/null || err=1
	fi
	if [ $err = 1 ]; then
		downloadFailed
	fi
else
	echo "Skipped downloading (1/3) spin source code. already present"
fi
if [ ! -f ispin.tcl ]; then
	echo "Downloading (2/3) iSpin tcl GUI from http://spinroot.com/spin/Src/ispin.tcl..."
	err=0
	wget http://spinroot.com/spin/Src/ispin.tcl 2> /dev/null > /dev/null || err=1
	if [ $err = 1 ]; then
		err=0
		echo "Couldn't download. Trying to download from mirror: http://www.safwat.xyz/spin/ispin.tcl"
		wget http://www.safwat.xyz/spin/ispin.tcl 2> /dev/null > /dev/null || err=1
	fi
	if [ $err = 1 ]; then
		downloadFailed
	fi
else
	echo "Skipped downloading (2/3) iSpin tcl GUI. Already present"
fi

#Download example
if [ ! -f example.pml ]; then
	echo "Downloading (3/3) sample code from http://www.safwat.xyz/spin/example.pml..."
	wget http://www.safwat.xyz/spin/example.pml 2> /dev/null || echo "Failed to download sample code. Ignoring error"
else
	echo "Skipped downloading (3/3) sample code. Already present"
fi

# VERIFY CHECKSUMS
echo "Downloads complete. Veryifing checksums..."
if [ "`sha256sum src647.tar.gz`" != "b04c6d7f36ef7763ef6943a8b38cbd08d72504d215d2861a6f2b8a5f36f11147  src647.tar.gz" ]; then
	echo "Security error. Checksum mismatch for src647.tar.gz"
	error "src647.tar.gz is corrupt. Try running again. Or try removing it and then run again. Or try to obtain an original copy."
fi

if [ $CHECKSUM_ISPIN = 1 ] && [ "`sha256sum ispin.tcl`" != "49850de229248f37e622bc303395cc5fa882f0c4d295e1122bb9395eda867f71  ispin.tcl" ] && \
[ "`sha256sum ispin.tcl`" != "19768d0c64590e20c670365b15730dea78f161f18d2e36f6232d2dd50623ca00  ispin.tcl" ]; then
	echo "Security error. Checksum mismatch for ispin.tcl"
	echo "ispin.tcl is corrupt or has been manually modified. Try running again. Or try removing it and then run again. Or try to obtain an original copy."
	error "If you know what you're doing and have intentionally modified it, set CHECKSUM_ISPIN to 0"
fi

if [ "`sha256sum example.pml`" != "dceea96e6c09b09f035645ca23b8b1a7276ac2dae463994f5df5e290d62a4d89  example.pml" ]; then
	rm example.pml
	echo "WARNING: example.pml is corrupt. Removed the file"
fi

#EXTRACT AND COMPILE
if [ -d Src6.4.7 ]; then echo "Removing leftover from previous compile (Src6.4.7)..."; rm -fr Src6.4.7; fi
echo "Checksums are ok. Compiling... (might take a few seconds/minutes)"
tar -xf src647.tar.gz || error "Failed to unzip"
cd Src6.4.7
make > compile_log.txt 2> compile_errors.txt || error "Compile failed! See compile_log.txt and compile_errors.txt"
mv spin ../spin_cli
cd ..
rm -fr Src6.4.7

#FINALIZE
echo "Compile success! Finalizing..."
perl -pe 's/(set SPIN +)spin/$1\.\/spin_cli/' -i ispin.tcl || error "Unexpected perl error"
chmod 755 spin_cli ispin.tcl || error "Unexpected permission set error"
chmod 666 example.pml || error "Unexpected permission set error #2"
echo "Finished everything."
echo ""
echo "#########"
echo "READY!"
echo "ATTENTION: Project must be in the same folder as spin"
echo "So, put your PML files in this folder:"
pwd
echo "Press ENTER to run SPIN"
read dummy
./ispin.tcl || error "Hmm... I couldn't run iSpin. You have a problem. try installing again"
echo "Spin has exited. use ./ispin.tcl to run next time. (or click on ispin in your GUI, if that works)"
echo "Bye!"
exit 0

#=================== Windows fallback ===================


# Called via hack in line 1.
:windows_detected
@echo off
echo This script does not work on Windows. Sorry!
}
