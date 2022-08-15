<script>
    import { domainRoot, appName } from "$src/lib/js/stores/configurations";
    const currentYear = new Date().getFullYear();
</script>

<footer class="footer footer-center fixed bottom-0 z-10 bg-base-300 p-4 text-base-content">
    <div>
        <p>
            © {currentYear} <a href={domainRoot}>{appName}</a> - All rights reserved
        </p>
    </div>
</footer>
