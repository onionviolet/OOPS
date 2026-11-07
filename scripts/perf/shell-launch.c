// Give the experimental executable its own macOS responsibility identity so
// WebKit XPC helpers can be attributed, instead of inheriting Codex's identity.
#include <spawn.h>
#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>
extern char **environ;
extern int responsibility_spawnattrs_setdisclaim(posix_spawnattr_t *, int);
int main(int argc, char **argv) {
    if (argc < 2) return 2;
    posix_spawnattr_t attr;
    posix_spawnattr_init(&attr);
    int e = responsibility_spawnattrs_setdisclaim(&attr, 1);
    if (e) return e;
    pid_t pid;
    e = posix_spawn(&pid, argv[1], NULL, &attr, argv + 1, environ);
    posix_spawnattr_destroy(&attr);
    if (e) return e;
    printf("%d\n", pid); fflush(stdout);
    int status;
    waitpid(pid, &status, 0);
    return WIFEXITED(status) ? WEXITSTATUS(status) : 1;
}
