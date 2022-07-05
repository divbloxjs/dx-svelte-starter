<script>
    import { domainRoot, appName } from "../../lib/js/stores/configurations";
    const currentYear = new Date().getFullYear();
</script>

<footer
    class="fixed bottom-0 z-10 p-4 footer bg-base-300 text-base-content footer-center"
>
    <div>
        <p>
            © {currentYear} <a href={domainRoot}>{appName}</a> - All rights reserved
        </p>
    </div>
</footer>
