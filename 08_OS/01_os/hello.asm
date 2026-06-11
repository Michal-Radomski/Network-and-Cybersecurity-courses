section .data
    msg db "Hello, World!", 10      ; The string to print, 10 is the newline character
    msg_len equ $ - msg             ; Calculate the length of the string automatically

section .text
    global _start                   ; Entry point for the linker

_start:
    ; 1. Syscall to write to the screen
    mov rax, 1                      ; system call number 1 is 'sys_write'
    mov rdi, 1                      ; file descriptor 1 is stdout (the screen)
    mov rsi, msg                    ; pointer to our string
    mov rdx, msg_len                ; length of our string
    syscall                         ; call the kernel

    ; 2. Syscall to exit the program
    mov rax, 60                     ; system call number 60 is 'sys_exit'
    mov rdi, 0                      ; exit code 0 (success)
    syscall                         ; call the kernel
