'use client'

import { useEffect } from "react";

export function DefaultScrollTop() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return null;
}