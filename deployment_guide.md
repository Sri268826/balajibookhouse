# Render Deployment Guide

This document outlines the steps to deploy the application to Render free tier with persistent data (SQLite database).

## Prerequisites

1.  A [Render](https://render.com/) account.
2.  Your code pushed to a GitHub repository.

## Step-by-Step Deployment

1.  Log in to the Render Dashboard.
2.  Click **New +** and select **Web Service**.
3.  Connect to your GitHub repository where this project lies.
4.  Configure the service details:
    *   **Name**: Choose a unique name (e.g., `bbh-store`).
    *   **Environment**: `Node`
    *   **Region**: Choose the closest region.
    *   **Branch**: `main`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
5.  **Critical Step:** Setup Persistent Disk for SQLite
    *   Scroll down to the **Advanced** section.
    *   Click **Add Disk**.
    *   **Name**: `data` (or any logical name).
    *   **Mount Path**: `/opt/render/project/src/data` (Render clones your repo to `/opt/render/project/src`, so we mount it to the `data` folder inside it).
    *   **Size**: 1 GB (Well within free limits).
6.  **Configure Environment Variables**
    *   Scroll to **Environment Variables**.
    *   Add the following variables:
        *   `NODE_ENV`: `production`
        *   `JWT_SECRET`: (Generate a secure secret)
        *   `DATABASE_PATH`: `/opt/render/project/src/data/database.db` (must match the Mount Path above + `/database.db`)
        *   `NEXT_PUBLIC_SITE_URL`: `https://YOUR-APP-NAME.onrender.com` (Update with your actual URL once created)
        *   `ADMIN_DEFAULT_PASSWORD`: `change_me_to_a_strong_password`
7.  Click **Create Web Service**.

## Post-Deployment Actions

1.  Monitor the build logs to ensure they succeed smoothly.
2.  Once live, navigate to `YOUR_APP_URL/admin` and log in using the `admin` username and `ADMIN_DEFAULT_PASSWORD`.
3.  Test your product forms and check the "WhatsApp Share" capability.

## Limitations on Free Tier

*   **Cold Starts**: Render free webservices will sleep after 15 minutes of inactivity. The first visitor after sleep will experience an initial load delay of ~10-30 seconds.
*   **Disk Data Persistence**: Persistent disks work beautifully with SQLite but keep regular backups manually if data is critical. Ensure `DATABASE_PATH` correctly maps to the disk mounted location.
