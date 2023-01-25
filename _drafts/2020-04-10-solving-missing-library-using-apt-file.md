---
layout: post
title: Solving missing library error using apt-file
date:   2020-05-10
categories: programming-notes
---

`apt-file` is a useful tool in finding missing libraries. It fetch the filelist
of all packages available in the repository and makes a searchable database from
filename to apt package name.

Install apt-file and build its database:

``` shellsession
$ sudo apt install apt-file
$ sudo apt-file update
```

# Example problem

One of our lab-mates was building Pangolin and he faced this error:

``` shellsession
Pangolin/build$ cmake --build .
Scanning dependencies of target pangolin
[  1%] Building CXX object src/CMakeFiles/pangolin.dir/display/display.cpp.o
[  2%] Building CXX object src/CMakeFiles/pangolin.dir/video/video.cpp.o
[  3%] Building CXX object src/CMakeFiles/pangolin.dir/fonts.cpp.o
[  4%] Linking CXX shared library libpangolin.so
/usr/bin/ld: cannot find -lEGL
collect2: error: ld returned 1 exit status
src/CMakeFiles/pangolin.dir/build.make:2311: recipe for target 'src/libpangolin.so' failed
make[2]: *** [src/libpangolin.so] Error 1
CMakeFiles/Makefile2:135: recipe for target 'src/CMakeFiles/pangolin.dir/all' failed
make[1]: *** [src/CMakeFiles/pangolin.dir/all] Error 2
Makefile:151: recipe for target 'all' failed
make: *** [all] Error 2
```

In this case, the error we focus on is: `/usr/bin/ld: cannot find -lEGL`

1. The desired library file name is either `libEGL.so` or `libEGL.a`
2. I can search which packages provide this file:

  ``` shellsession
  $ apt-file search libEGL.so libEGL.a
  chromium-browser: /usr/lib/chromium-browser/swiftshader/libEGL.so
  libegl1: /usr/lib/x86_64-linux-gnu/libEGL.so.1
  libegl1: /usr/lib/x86_64-linux-gnu/libEGL.so.1.0.0
  libglvnd-dev: /usr/lib/x86_64-linux-gnu/libEGL.so
  nvidia-340: /usr/lib/i386-linux-gnu/libEGL.so
  nvidia-340: /usr/lib/i386-linux-gnu/libEGL.so.1
  nvidia-340: /usr/lib/i386-linux-gnu/libEGL.so.340.106
  nvidia-340: /usr/lib/i386-linux-gnu/libEGL.so.340.108
  nvidia-340: clibEGL.so
  nvidia-340: /usr/lib/x86_64-linux-gnu/libEGL.so.1
  nvidia-340: /usr/lib/x86_64-linux-gnu/libEGL.so.340.106
  nvidia-340: /usr/lib/x86_64-linux-gnu/libEGL.so.340.108
  virtualbox-guest-x11: /usr/lib/virtualbox/additions/libEGL.so
  virtualbox-guest-x11: /usr/lib/virtualbox/additions/libEGL.so.1
  virtualbox-guest-x11-hwe: /usr/lib/virtualbox/additions/libEGL.so
  virtualbox-guest-x11-hwe: /usr/lib/virtualbox/additions/libEGL.so.1

  ```

3. Chromium browswer and virtualbox bring their on libEGL. We don't want that. nvidia-340 is too old of a driver. We are on nvidia-418.  libegl1 is important but it only provides versioned (libEGL.so.1 etc). So we install libglvnd-dev.

  ``` shellsession
    sudo apt install libglvnd-dev
  ```


4. Try to compile again.


# Template for solving such problems

1. Convert the {library_name} in to library file name: lib{library_name}.so or lib{library_name}.a
2. Look for the file in installed files or available libraries using apt-file search (apt-file can be installed by `sudo apt install apt-file` and then the database can be build by `sudo apt-file update`).

Search in all available packages:
apt-file search lib{library_name}.so or lib{library_name}.a

3. Choose and install the most specific library
4. If needed configure the CMAKE_PREFIX_PATH or LIBRARY_PATH or LD_LIBRARY_PATH to help linker find the library, if the library is not in one the standard paths (/usr/lib/x86_64-linux-gnu, /usr/lib, /usr/local/lib/x86_64-linux-gnu, /usr/local/lib)
